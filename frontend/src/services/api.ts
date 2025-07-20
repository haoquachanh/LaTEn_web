/**
 * API Client Module
 *
 * Enterprise-grade HTTP client with advanced error handling,
 * automatic token management, and retry capabilities.
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import config from '@/config/app.config';

/**
 * API Response Error shape for consistent error handling
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Get API URL from multiple sources with precedence
 */
function getApiUrl(): string {
  // 1. Runtime platform override (CDN, proxy configurations)
  if (typeof window !== 'undefined' && window.LATEN_CONFIG?.SERVER_URL) {
    return window.LATEN_CONFIG.SERVER_URL;
  }

  // 2. Environment variables (from build or platform)
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }

  // 3. Default from app config based on environment
  return config.api.baseUrl;
}

/**
 * Create and configure the API client instance
 */
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  withCredentials: config.api.withCredentials,
  timeout: config.api.timeout,
});

/**
 * Format error responses consistently
 */
function formatError(error: AxiosError): ApiError {
  const response = error.response;

  if (!response) {
    return {
      message: error.message || 'Network error',
      status: 0,
      code: 'NETWORK_ERROR',
    };
  }

  // Extract error details from response
  const data = response.data as any;

  return {
    message: data?.message || 'An unexpected error occurred',
    status: response.status,
    code: data?.code || `ERROR_${response.status}`,
    errors: data?.errors,
  };
}

/**
 * Request interceptor - Add auth tokens and other headers
 */
api.interceptors.request.use(
  (axiosConfig: InternalAxiosRequestConfig) => {
    // Get token from storage
    const token = typeof window !== 'undefined' ? localStorage.getItem(config.auth.storageKeys.token) : null;

    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracing
    const requestId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    axiosConfig.headers['X-Request-ID'] = requestId;

    return axiosConfig;
  },
  (error) => {
    console.error('API Request Setup Error:', error);
    return Promise.reject(formatError(error));
  },
);

/**
 * Response interceptor - Handle errors and token refresh
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshToken = localStorage.getItem(config.auth.storageKeys.refreshToken);
        if (!refreshToken) throw new Error('No refresh token available');

        // Try to refresh token
        const { data } = await axios.post(`${getApiUrl()}/auth/refresh`, { refreshToken });

        // Store new tokens
        localStorage.setItem(config.auth.storageKeys.token, data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem(config.auth.storageKeys.refreshToken, data.refreshToken);
        }

        // Update the failed request with new token and retry
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem(config.auth.storageKeys.token);
        localStorage.removeItem(config.auth.storageKeys.refreshToken);
        localStorage.removeItem(config.auth.storageKeys.user);

        if (typeof window !== 'undefined') {
          // Redirect to login
          window.location.href = '/login';
        }

        return Promise.reject({
          message: 'Session expired. Please login again.',
          code: 'SESSION_EXPIRED',
          status: 401,
        } as ApiError);
      }
    }

    // Format and return other errors
    return Promise.reject(formatError(error));
  },
);

export default api;
