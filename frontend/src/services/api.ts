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
  // 0. Check current origin for CORS compatibility
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const isLocalhost127 = currentOrigin.includes('127.0.0.1');

  // 1. Runtime platform override (CDN, proxy configurations)
  if (typeof window !== 'undefined' && window.LATEN_CONFIG?.SERVER_URL) {
    const serverUrl = window.LATEN_CONFIG.SERVER_URL;
    return serverUrl;
  }

  // 2. Environment variables (from build or platform)
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    let serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    // Adjust URL if using 127.0.0.1 to maintain CORS compatibility
    if (isLocalhost127 && serverUrl.includes('localhost')) {
      serverUrl = serverUrl.replace('localhost', '127.0.0.1');
    }

    return serverUrl;
  }

  // 3. Default from app config based on environment
  let baseUrl = config.api.baseUrl;

  // Adjust URL if using 127.0.0.1 to maintain CORS compatibility
  if (isLocalhost127 && baseUrl.includes('localhost')) {
    baseUrl = baseUrl.replace('localhost', '127.0.0.1');
  }

  return baseUrl;
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
        // Xử lý URL một cách đúng đắn
        let baseUrl = getApiUrl();

        // Đảm bảo sử dụng đúng đường dẫn API
        let url;
        if (baseUrl.includes('/api')) {
          // Nếu baseUrl đã có /api thì tạo URL dưới dạng baseUrl/auth/refresh
          if (baseUrl.endsWith('/api')) {
            url = `${baseUrl}/auth/refresh`;
          } else {
            // Trường hợp baseUrl có dạng http://localhost:3001/api/v1
            // Cần lấy phần trước /api
            const baseRoot = baseUrl.substring(0, baseUrl.indexOf('/api'));
            url = `${baseRoot}/api/auth/refresh`;
          }
        } else {
          // Nếu baseUrl không có /api, thêm vào
          url = `${baseUrl}/api/auth/refresh`;
        }

        const { data } = await axios.post(url, { refreshToken });

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
