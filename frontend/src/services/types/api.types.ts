/**
 * API Response Types
 *
 * This file contains types for standard API responses across the application.
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

/**
 * Standard error format used throughout the application
 */
export interface AppError extends Error {
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Validation error field format
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

/**
 * Backend service health status
 */
export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  services: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'unhealthy';
      message?: string;
    };
  };
}
