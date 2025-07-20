/**
 * Error handling utility for application-wide consistent error handling
 */

import { toast } from 'react-hot-toast';

// Error types
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

// Error with additional properties
export interface AppError extends Error {
  type?: ErrorType;
  code?: string;
  details?: any;
  status?: number;
}

/**
 * Create a standardized application error
 */
export function createAppError(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  options: Partial<AppError> = {},
): AppError {
  const error = new Error(message) as AppError;
  error.type = type;

  if (options.code) error.code = options.code;
  if (options.details) error.details = options.details;
  if (options.status) error.status = options.status;

  return error;
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any): AppError {
  // Handle axios errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data || {};

    // Map HTTP status codes to error types
    let type = ErrorType.UNKNOWN;
    if (status === 401 || status === 403) type = ErrorType.AUTH;
    else if (status === 404) type = ErrorType.NOT_FOUND;
    else if (status === 422 || status === 400) type = ErrorType.VALIDATION;
    else if (status >= 500) type = ErrorType.SERVER;

    return createAppError(data.message || `API error (${status})`, type, {
      code: data.code || `HTTP_${status}`,
      details: data.errors || data.details,
      status,
    });
  }

  // Network errors
  if (error.request) {
    return createAppError('Network error. Please check your connection.', ErrorType.NETWORK);
  }

  // Unknown errors
  return createAppError(error.message || 'An unexpected error occurred', ErrorType.UNKNOWN);
}

/**
 * Display appropriate error message to user
 */
export function displayErrorToast(error: AppError | Error | any) {
  const appError = error.type ? (error as AppError) : handleApiError(error);

  let message = appError.message;

  // Customize messages based on error type
  switch (appError.type) {
    case ErrorType.AUTH:
      message = 'Authentication error. Please log in again.';
      break;
    case ErrorType.NETWORK:
      message = 'Network connection error. Please check your connection.';
      break;
    case ErrorType.VALIDATION:
      message = appError.message || 'Please check your input and try again.';
      break;
    case ErrorType.SERVER:
      message = 'Server error. Our team has been notified.';
      break;
  }

  // Log for debugging
  console.error('Error:', appError);

  // Display toast
  toast.error(message);

  return appError;
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    return fallback;
  }
}
