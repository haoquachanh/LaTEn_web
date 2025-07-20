/**
 * Enhanced API Client
 *
 * Advanced API client with request queuing, retry capability,
 * and comprehensive error handling.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiErrorResponse } from './types/api.types';
import { createAppError, ErrorType } from '@/utils/errorHandling';

// Constants
const MAX_CONCURRENT_REQUESTS = 6;
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Request queue for limiting concurrent API calls
 */
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  private maxConcurrentRequests: number;

  constructor(maxConcurrent = MAX_CONCURRENT_REQUESTS) {
    this.maxConcurrentRequests = maxConcurrent;
  }

  /**
   * Add a request to the queue
   */
  public add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Add wrapped request to queue
      const wrappedRequest = async () => {
        try {
          this.activeRequests++;
          const result = await requestFn();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        } finally {
          this.activeRequests--;
          this.processNext();
        }
      };

      this.queue.push(wrappedRequest);

      // Process queue if possible
      if (this.activeRequests < this.maxConcurrentRequests) {
        this.processNext();
      }
    });
  }

  /**
   * Process next request in queue
   */
  private processNext(): void {
    if (this.queue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const nextRequest = this.queue.shift();
      if (nextRequest) {
        nextRequest().catch(() => {
          // Errors are handled in the wrapped request
        });
      }
    }
  }
}

/**
 * Create an enhanced API client with advanced features
 */
export const createEnhancedApiClient = (config: {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}): AxiosInstance => {
  // Create queue
  const requestQueue = new RequestQueue();

  // Create base instance
  const apiClient = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.headers,
    },
  });

  // Add request interceptor for auth tokens
  apiClient.interceptors.request.use(
    (config) => {
      // Get auth token from storage if it exists
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('laten_auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracing
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        config.headers['X-Request-ID'] = requestId;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Add response interceptor for error handling and token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // Handle token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const refreshToken = localStorage.getItem('laten_refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
            `${config.baseURL}/auth/refresh`,
            { refreshToken },
            { baseURL: config.baseURL },
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens
          localStorage.setItem('laten_auth_token', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('laten_refresh_token', newRefreshToken);
          }

          // Update authorization header and retry
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and return to login
          localStorage.removeItem('laten_auth_token');
          localStorage.removeItem('laten_refresh_token');
          localStorage.removeItem('laten_user');

          // Only redirect if in browser
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }

          // Convert to standardized error
          return Promise.reject(
            createAppError('Authentication session expired. Please log in again.', ErrorType.AUTH, {
              status: 401,
              code: 'SESSION_EXPIRED',
            }),
          );
        }
      }

      // Handle retries for network errors or 5xx server errors
      if (
        (error.code === 'ECONNABORTED' ||
          error.code === 'ETIMEDOUT' ||
          (error.response && error.response.status >= 500)) &&
        originalRequest &&
        originalRequest._retryCount < RETRY_COUNT
      ) {
        // Initialize retry count if not exists
        originalRequest._retryCount = originalRequest._retryCount || 0;
        originalRequest._retryCount++;

        // Exponential backoff delay
        const delay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);

        // Retry after delay
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(axios(originalRequest));
          }, delay);
        });
      }

      // Convert to standardized error format
      const apiError: ApiErrorResponse = {
        message: error.response?.data?.message || 'An unexpected error occurred',
        status: error.response?.status || 0,
        code: error.response?.data?.code,
        errors: error.response?.data?.errors,
      };

      // Determine error type
      let errorType = ErrorType.UNKNOWN;
      if (!error.response) errorType = ErrorType.NETWORK;
      else if (error.response.status === 401 || error.response.status === 403) errorType = ErrorType.AUTH;
      else if (error.response.status === 404) errorType = ErrorType.NOT_FOUND;
      else if (error.response.status === 422 || error.response.status === 400) errorType = ErrorType.VALIDATION;
      else if (error.response.status >= 500) errorType = ErrorType.SERVER;

      // Create standardized error
      return Promise.reject(
        createAppError(apiError.message, errorType, {
          code: apiError.code,
          details: apiError.errors,
          status: apiError.status,
        }),
      );
    },
  );

  // Wrap API methods with queue
  const originalRequest = apiClient.request;
  apiClient.request = function <T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return requestQueue.add<R>(() => originalRequest.call(this, config));
  };

  return apiClient;
};

// Create default enhanced client
const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api');

export const enhancedApiClient = createEnhancedApiClient({
  baseURL: serverUrl,
});

// Typed API methods
export const api = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await enhancedApiClient.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await enhancedApiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await enhancedApiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await enhancedApiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await enhancedApiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },
};

export default api;
