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

const { token: TOKEN_KEY, refreshToken: REFRESH_TOKEN_KEY, user: USER_KEY } = config.auth.storageKeys;
let tokenExpiryTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Securely store authentication data
 * Private helper function
 * @param data - Authentication response data
 */
function storeAuthData(data: AuthResponse): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
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
      if (response.data && response.data.access_token) {
        storeAuthData(response.data);
      }
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
      if (response.data && response.data.access_token) {
        storeAuthData(response.data);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error);
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
    if (tokenExpiryTimer) {
      clearTimeout(tokenExpiryTimer);
      tokenExpiryTimer = null;
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
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
      AuthService.logout();
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
        try {
          await AuthService.refreshToken();
          const retryResponse = await api.get<AuthUser>('/auth/profile');
          return retryResponse.data;
        } catch (refreshError) {
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
      if (response.data && response.data.access_token) {
        localStorage.setItem(TOKEN_KEY, response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
        }
      }
      return response.data;
    } catch (error: any) {
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
   * Performs comprehensive validation of authentication status
   * @returns Boolean indicating authentication status
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      // Get token and user from storage
      const token = localStorage.getItem(TOKEN_KEY);
      const user = AuthService.getCurrentUser();

      if (!token || !user) return false;

      // Basic token validation - check if it's a valid JWT format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      // Parse the payload to check expiration if possible
      try {
        const payload = JSON.parse(atob(tokenParts[1]));
        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          AuthService.logout(); // Automatically logout if token expired
          return false;
        }
      } catch (e) {
        // If we can't parse the token, we'll still consider it valid if it exists
        // The API calls will fail and trigger a refresh if needed
      }

      return true;
    } catch (error) {
      // In case of any error, consider not authenticated
      console.error('Error checking authentication status', error);
      return false;
    }
  },
};

export default AuthService;
