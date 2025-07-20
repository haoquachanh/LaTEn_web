/**
 * Authentication Service
 *
 * Enterprise-grade authentication service with secure token management,
 * automatic token refresh, and comprehensive error handling.
 *
 * @module AuthService
 */
import api from './api';
import config from '@/config/app.config';
import {
  AuthUser,
  AuthResponse,
  TokenRefreshResponse,
  LoginCredentials,
  RegisterData,
  AuthError,
} from './types/auth.types';

// Storage keys from config
const { token: TOKEN_KEY, refreshToken: REFRESH_TOKEN_KEY, user: USER_KEY } = config.auth.storageKeys;

// Private state for token refresh mechanism
let tokenExpiryTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Security timeout for token expiration
 * Use a slightly shorter window than the actual token expiration
 * to account for network latency and clock skew
 */
const TOKEN_EXPIRY_BUFFER = 60 * 1000; // 1 minute buffer

/**
 * Securely store authentication data
 * Private helper function
 * @param data - Authentication response data
 */
function storeAuthData(data: AuthResponse): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

/**
 * Set a timer to refresh the token before it expires
 * Private helper function
 * @param expiresIn - Token expiration time in seconds
 */
function setTokenExpiryTimer(expiresIn: number): void {
  if (typeof window === 'undefined') return;

  // Clear existing timer if any
  if (tokenExpiryTimer) {
    clearTimeout(tokenExpiryTimer);
  }

  // Convert expiresIn to milliseconds and subtract buffer
  const refreshTime = expiresIn * 1000 - TOKEN_EXPIRY_BUFFER;

  // Set timer to refresh token before it expires
  tokenExpiryTimer = setTimeout(async () => {
    try {
      await AuthService.refreshToken();
    } catch (error) {
      console.error('Auto token refresh failed:', error);
      // Logout handled in refreshToken
    }
  }, refreshTime);
}

/**
 * Auth Service provides authentication functionality
 * with secure token management and storage
 */
const AuthService = {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with user data
   * @throws AuthError if registration fails
   */
  register: async (userData: RegisterData): Promise<AuthUser> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      return response.data.user;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Registration failed';
      const errorCode = error?.response?.status || 500;
      throw { message: errorMessage, code: errorCode, status: error?.response?.status } as AuthError;
    }
  },

  /**
   * Authenticate user and store tokens securely
   * @param credentials - Login credentials
   * @returns Promise with auth response
   * @throws AuthError if authentication fails
   */
  login: async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });

      // Store tokens and user info securely
      if (response.data && response.data.accessToken) {
        // Store tokens
        storeAuthData(response.data);

        // Set token expiry timer if expiresIn is provided
        if (response.data.expiresIn) {
          setTokenExpiryTimer(response.data.expiresIn);
        }
      }

      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Login failed';
      throw {
        message: errorMessage,
        code: error?.response?.data?.code || 'AUTH_ERROR',
        status: error?.response?.status,
      } as AuthError;
    }
  },

  /**
   * Remove all authentication data and tokens
   * Performs a secure logout operation
   */
  logout: () => {
    // Clear token expiry timer if exists
    if (tokenExpiryTimer) {
      clearTimeout(tokenExpiryTimer);
      tokenExpiryTimer = null;
    }

    // Remove all authentication data
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Clear any session cookies that might exist
      document.cookie.split(';').forEach((cookie) => {
        const [name] = cookie.trim().split('=');
        if (name && (name.includes('auth') || name.includes('token'))) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    }
  },

  /**
   * Get currently authenticated user from secure storage
   * @returns User object or null if not authenticated
   */
  getCurrentUser: (): AuthUser | null => {
    try {
      if (typeof window === 'undefined') return null;

      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) return null;

      return JSON.parse(userStr) as AuthUser;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      AuthService.logout(); // Clear potentially corrupted data
      return null;
    }
  },

  /**
   * Fetch current user profile from the server
   * Requires valid authentication token
   * @returns Promise with user profile data
   * @throws AuthError if profile fetch fails
   */
  getProfile: async (): Promise<AuthUser> => {
    try {
      const response = await api.get<AuthUser>('/auth/profile');

      // Update stored user data with fresh profile data
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && typeof window !== 'undefined') {
        localStorage.setItem(
          USER_KEY,
          JSON.stringify({
            ...currentUser,
            ...response.data,
          }),
        );
      }

      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        // Token likely expired, attempt refresh
        try {
          await AuthService.refreshToken();
          // Retry profile fetch after refresh
          const retryResponse = await api.get<AuthUser>('/auth/profile');
          return retryResponse.data;
        } catch (refreshError) {
          // If refresh also fails, force logout
          AuthService.logout();
          throw { message: 'Session expired, please login again' } as AuthError;
        }
      }

      throw error?.response?.data || ({ message: 'Failed to fetch profile' } as AuthError);
    }
  },

  /**
   * Refresh authentication token using stored refresh token
   * @returns Promise with new token data
   * @throws AuthError if refresh fails
   */
  refreshToken: async (): Promise<TokenRefreshResponse> => {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await api.post<TokenRefreshResponse>('/auth/refresh', { refreshToken });

      if (response.data && response.data.accessToken) {
        // Update stored tokens
        localStorage.setItem(TOKEN_KEY, response.data.accessToken);

        // Update refresh token if provided
        if (response.data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        }

        // Reset expiry timer if provided
        if (response.data.expiresIn) {
          setTokenExpiryTimer(response.data.expiresIn);
        }
      }

      return response.data;
    } catch (error: any) {
      // If refresh fails, force logout
      AuthService.logout();
      throw {
        message: error?.response?.data?.message || 'Session expired',
        code: 'REFRESH_FAILED',
        status: error?.response?.status,
      } as AuthError;
    }
  },

  /**
   * Check if user is authenticated with a valid token
   * @returns Boolean indicating authentication status
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem(TOKEN_KEY);
    const user = AuthService.getCurrentUser();

    return !!(token && user);
  },
};

export default AuthService;
