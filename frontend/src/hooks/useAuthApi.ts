/**
 * Authentication API Hooks
 *
 * Custom hooks for accessing authentication-related API endpoints
 * using the SWR data fetching pattern.
 */
import { useCallback } from 'react';
import { useApiMutation, useApiQuery } from './useApiQuery';
import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  TokenRefreshResponse,
} from '@/services/types/auth.types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Base API endpoint
const AUTH_API = '/auth';

// Storage keys - Import từ config để đảm bảo đồng bộ
import config from '@/config/app.config';
const { token: TOKEN_KEY, refreshToken: REFRESH_TOKEN_KEY, user: USER_KEY } = config.auth.storageKeys;

/**
 * Hook to login a user
 */
export function useLogin() {
  const { login: contextLogin } = useAuth();
  const { isMutating } = useApiMutation<LoginCredentials, AuthResponse>(`${AUTH_API}/login`);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      // Luôn dùng login từ AuthContext để cập nhật state toàn app
      return await contextLogin(credentials);
    },
    [contextLogin],
  );

  return { login, isLoading: isMutating };
}

/**
 * Hook to register a new user
 */
export function useRegister() {
  const { trigger, isMutating } = useApiMutation<RegisterData, AuthResponse>(`${AUTH_API}/register`);

  const register = useCallback(
    async (userData: RegisterData) => {
      try {
        return await trigger(userData);
      } catch (error) {
        throw error;
      }
    },
    [trigger],
  );

  return { register, isLoading: isMutating };
}

/**
 * Hook to logout a user
 */
export function useLogout() {
  const { logout: contextLogout } = useAuth();
  const router = useRouter();

  const logout = useCallback(() => {
    contextLogout();
    router.push('/auth/login');
  }, [contextLogout, router]);

  return { logout };
}

/**
 * Hook to refresh auth token
 */
export function useRefreshToken() {
  const { trigger } = useApiMutation<{ refreshToken: string }, TokenRefreshResponse>(`${AUTH_API}/refresh`);

  const refreshToken = useCallback(async () => {
    if (typeof window === 'undefined') return null;

    const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshTokenValue) return null;

    try {
      const response = await trigger({ refreshToken: refreshTokenValue });

      // Update stored tokens
      localStorage.setItem(TOKEN_KEY, response.access_token);

      if (response.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
      }

      return response;
    } catch (error) {
      // If refresh fails, logout
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }, [trigger]);

  return { refreshToken };
}

/**
 * Hook to get current authenticated user
 */
export function useCurrentUser() {
  return useApiQuery<AuthUser>(`${AUTH_API}/profile`, {
    shouldRetryOnError: false,
    onError: () => {
      // Clear invalid auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    },
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const { trigger, isMutating } = useApiMutation<Partial<AuthUser>, AuthUser>(`${AUTH_API}/profile`);

  const updateProfile = useCallback(
    async (userData: Partial<AuthUser>) => {
      try {
        return await trigger(userData);
      } catch (error) {
        throw error;
      }
    },
    [trigger],
  );

  return { updateProfile, isLoading: isMutating };
}
