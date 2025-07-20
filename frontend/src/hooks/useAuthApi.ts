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

// Base API endpoint
const AUTH_API = '/auth';

// Storage keys - Import từ config để đảm bảo đồng bộ
import config from '@/config/app.config';
const { token: TOKEN_KEY, refreshToken: REFRESH_TOKEN_KEY, user: USER_KEY } = config.auth.storageKeys;

/**
 * Hook to login a user
 */
export function useLogin() {
  const { trigger, isMutating } = useApiMutation<LoginCredentials, AuthResponse>(`${AUTH_API}/login`);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      // Gọi trực tiếp AuthService.login để đảm bảo đồng bộ với AuthContext
      import('@/services/auth.service').then(({ default: AuthService }) => {
        AuthService.login(credentials).catch((error: Error) => console.error('Login failed:', error));
      });

      return {
        accessToken: localStorage.getItem(TOKEN_KEY) || '',
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || '',
        user: JSON.parse(localStorage.getItem(USER_KEY) || '{}'),
        expiresIn: 3600,
      };
    } catch (error) {
      throw error;
    }
  }, []);

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
        return await trigger('', { data: userData });
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
  const router = useRouter();

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Sử dụng AuthService để đảm bảo việc đăng xuất được xử lý đồng bộ
      import('@/services').then(({ AuthService }) => {
        AuthService.logout();

        // Redirect to login page
        router.push('/auth/login');
      });
    }
  }, [router]);

  return { logout };
}

/**
 * Hook to refresh auth token
 */
export function useRefreshToken() {
  const { trigger } = useApiMutation<{ refreshToken: string }, TokenRefreshResponse>(`${AUTH_API}/refresh`);

  const refreshToken = useCallback(async () => {
    if (typeof window === 'undefined') return null;

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    try {
      const response = await trigger('', {
        data: { refreshToken },
        method: 'POST',
      });

      // Update stored tokens
      localStorage.setItem(TOKEN_KEY, response.accessToken);

      if (response.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
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
    // Only attempt to fetch if we have a token
    enabled: typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY),
    // Don't show errors if user isn't authenticated
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
        return await trigger('', {
          data: userData,
          method: 'PATCH',
        });
      } catch (error) {
        throw error;
      }
    },
    [trigger],
  );

  return { updateProfile, isLoading: isMutating };
}
