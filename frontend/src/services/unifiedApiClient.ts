/**
 * Unified API Client
 *
 * Centralized HTTP client with:
 * - Consistent error handling
 * - Automatic response parsing
 * - Loading state management
 * - Request/response interceptors
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '@/config/apiRoutes';

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
  errors?: Record<string, string[]>;
  timestamp?: string;
  requestId?: string;
}

/**
 * API Error structure
 */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  code?: string;
}

/**
 * Request configuration with additional options
 */
export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  skipAuth?: boolean;
}

/**
 * Unified API Client class
 */
class UnifiedApiClient {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token && !config.headers?.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        const requestId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        config.headers['X-Request-ID'] = requestId;

        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as RequestConfig & { _retry?: boolean };

        // Handle 401 - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Attempt to refresh token
            const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
            const tokens = refreshResponse.data.data || refreshResponse.data;

            // Save new tokens
            this.setAuthToken(tokens.accessToken);
            this.setRefreshToken(tokens.refreshToken);

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            }
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            this.clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(this.handleError(error));
          }
        }

        return Promise.reject(this.handleError(error));
      },
    );
  }

  /**
   * Handle and format API errors
   */
  private handleError(error: AxiosError): ApiError {
    if (!error.response) {
      return {
        message: error.message || 'Network error. Please check your connection.',
        statusCode: 0,
        code: 'NETWORK_ERROR',
      };
    }

    const response = error.response.data as any;

    return {
      message: response?.message || 'An unexpected error occurred',
      statusCode: error.response.status,
      errors: response?.errors,
      code: response?.code || `ERROR_${error.response.status}`,
    };
  }

  /**
   * Get auth token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || this.authToken;
  }

  /**
   * Get refresh token from storage
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    this.authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Extract data from standard API response
   */
  private extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
    // Handle different response formats for backward compatibility
    const responseData = response.data;

    // Standard format: { statusCode, message, data }
    if ('data' in responseData && responseData.data !== undefined) {
      return responseData.data;
    }

    // Fallback: return response as-is
    return responseData as unknown as T;
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return this.extractData(response);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return this.extractData(response);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return this.extractData(response);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return this.extractData(response);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return this.extractData(response);
  }

  /**
   * Get full response (for accessing meta, etc.)
   */
  async getFullResponse<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Post with full response
   */
  async postFullResponse<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }
}

// Export singleton instance
const apiClient = new UnifiedApiClient();
export default apiClient;
