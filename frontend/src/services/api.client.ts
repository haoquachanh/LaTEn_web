/**
 * API Client Module
 *
 * Enterprise-grade HTTP client with advanced error handling,
 * automatic token management, and retry capabilities.
 *
 * @module ApiClient
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import config from '@/config/app.config';

/**
 * Platform-specific configuration injected at runtime
 */
interface LaténConfig {
  SERVER_URL?: string;
  API_VERSION?: string;
  [key: string]: any;
}

// Using Record<string, any> to match the type in app.config.ts

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
 * API Client class with robust error handling and retry capabilities
 */
class ApiClient {
  private instance: AxiosInstance;
  private retryDelay = 1000; // ms
  private maxRetries = 2;

  constructor() {
    this.instance = axios.create({
      baseURL: this.getApiUrl(),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      },
      withCredentials: config.api.withCredentials,
      timeout: config.api.timeout,
    });

    this.setupInterceptors();
  }

  /**
   * Determine API URL from multiple sources with precedence
   */
  private getApiUrl(): string {
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
   * Configure request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - Add auth tokens and other headers
    this.instance.interceptors.request.use(this.handleRequest.bind(this), this.handleRequestError.bind(this));

    // Response interceptor - Handle errors and token refresh
    this.instance.interceptors.response.use(this.handleResponse.bind(this), this.handleResponseError.bind(this));
  }

  /**
   * Process outgoing requests
   * Add authentication and other headers
   */
  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = this.getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracing
    config.headers['X-Request-ID'] = this.generateRequestId();

    // Add timestamp
    config.headers['X-Request-Time'] = new Date().toISOString();

    return config;
  }

  /**
   * Handle request setup errors
   */
  private handleRequestError(error: any): Promise<never> {
    console.error('API Request Setup Error:', error);
    return Promise.reject({
      message: 'Failed to setup request',
      status: 0,
      code: 'REQUEST_SETUP_ERROR',
    } as ApiError);
  }

  /**
   * Process successful responses
   */
  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  /**
   * Handle API response errors with advanced recovery strategies
   */
  private async handleResponseError(error: AxiosError): Promise<any> {
    const { config, response } = error;

    // No config means the request wasn't sent
    if (!config) {
      console.error('API Client Error:', error);
      return Promise.reject({
        message: 'Request failed to send',
        status: 0,
        code: 'REQUEST_FAILED',
      } as ApiError);
    }

    // Handle retry for network errors or specific status codes
    if (!response || response.status >= 500) {
      return this.handleRetry(error);
    }

    // Handle 401 unauthorized with token refresh
    if (response.status === 401) {
      return this.handleUnauthorized(error);
    }

    // Format other errors consistently
    return Promise.reject(this.formatError(error));
  }

  /**
   * Implement retry logic for failed requests
   */
  private async handleRetry(error: AxiosError): Promise<any> {
    const config = error.config as any;

    // Initialize retry count
    config.retryCount = config.retryCount ?? 0;

    // Check if we should retry
    if (config.retryCount >= this.maxRetries) {
      return Promise.reject(this.formatError(error));
    }

    // Increase retry count
    config.retryCount += 1;

    // Exponential backoff
    const delay = this.retryDelay * Math.pow(2, config.retryCount - 1);

    // Wait and then retry
    await new Promise((resolve) => setTimeout(resolve, delay));
    return this.instance(config);
  }

  /**
   * Handle unauthorized errors with token refresh
   */
  private async handleUnauthorized(error: AxiosError): Promise<any> {
    const originalRequest = error.config as any;

    // Avoid infinite refresh loops
    if (originalRequest._retry) {
      // Force logout through auth mechanism
      this.clearTokens();

      // Redirect to login if in browser
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject({
        message: 'Session expired. Please login again.',
        status: 401,
        code: 'SESSION_EXPIRED',
      } as ApiError);
    }

    originalRequest._retry = true;

    try {
      // Try to refresh token
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      // Call auth refresh endpoint directly to avoid circular dependencies
      const response = await axios.post(`${this.getApiUrl()}/auth/refresh`, { refreshToken });

      // Update tokens
      this.storeTokens(response.data);

      // Retry the original request with new token
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
      return this.instance(originalRequest);
    } catch (refreshError) {
      // Clear tokens and redirect
      this.clearTokens();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject({
        message: 'Authentication failed. Please login again.',
        status: 401,
        code: 'AUTH_REFRESH_FAILED',
      } as ApiError);
    }
  }

  /**
   * Format error responses consistently
   */
  private formatError(error: AxiosError): ApiError {
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
   * Generate unique request ID for tracing
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.auth.storageKeys.token);
  }

  /**
   * Get refresh token from storage
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.auth.storageKeys.refreshToken);
  }

  /**
   * Store authentication tokens
   */
  private storeTokens(data: { accessToken: string; refreshToken?: string }): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(config.auth.storageKeys.token, data.accessToken);

    if (data.refreshToken) {
      localStorage.setItem(config.auth.storageKeys.refreshToken, data.refreshToken);
    }
  }

  /**
   * Clear authentication tokens
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(config.auth.storageKeys.token);
    localStorage.removeItem(config.auth.storageKeys.refreshToken);
    localStorage.removeItem(config.auth.storageKeys.user);
  }

  /**
   * Public API methods
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config).then((response) => response.data);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config).then((response) => response.data);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config).then((response) => response.data);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config).then((response) => response.data);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config).then((response) => response.data);
  }

  /**
   * Access the underlying axios instance for advanced use cases
   */
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
