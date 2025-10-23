/**
 * Custom Error Classes for Examination Module
 *
 * Provides consistent error handling across the examination system
 */

export enum ExaminationErrorCode {
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Examination errors
  EXAM_NOT_FOUND = 'EXAM_NOT_FOUND',
  EXAM_ALREADY_STARTED = 'EXAM_ALREADY_STARTED',
  EXAM_ALREADY_COMPLETED = 'EXAM_ALREADY_COMPLETED',
  EXAM_EXPIRED = 'EXAM_EXPIRED',

  // Start examination errors
  START_EXAM_FAILED = 'START_EXAM_FAILED',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  NO_QUESTIONS_AVAILABLE = 'NO_QUESTIONS_AVAILABLE',

  // Submit errors
  SUBMIT_ANSWER_FAILED = 'SUBMIT_ANSWER_FAILED',
  SUBMIT_EXAM_FAILED = 'SUBMIT_EXAM_FAILED',
  INVALID_ANSWER_FORMAT = 'INVALID_ANSWER_FORMAT',

  // Question errors
  QUESTION_NOT_FOUND = 'QUESTION_NOT_FOUND',
  INVALID_QUESTION_TYPE = 'INVALID_QUESTION_TYPE',

  // Authorization errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Time errors
  TIME_EXPIRED = 'TIME_EXPIRED',
  INVALID_TIME_SPENT = 'INVALID_TIME_SPENT',
}

/**
 * Base Examination Error Class
 */
export class ExaminationError extends Error {
  public readonly code: ExaminationErrorCode;
  public readonly statusCode?: number;
  public readonly timestamp: Date;
  public readonly details?: any;

  constructor(
    message: string,
    code: ExaminationErrorCode = ExaminationErrorCode.UNKNOWN_ERROR,
    statusCode?: number,
    details?: any,
  ) {
    super(message);
    this.name = 'ExaminationError';
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date();
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExaminationError);
    }
  }

  /**
   * Convert error to JSON format for logging or API responses
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      details: this.details,
      stack: this.stack,
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    const errorMessages: Record<ExaminationErrorCode, string> = {
      [ExaminationErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
      [ExaminationErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
      [ExaminationErrorCode.VALIDATION_ERROR]: 'Invalid input. Please check your data and try again.',

      [ExaminationErrorCode.EXAM_NOT_FOUND]: 'Examination not found. It may have been deleted.',
      [ExaminationErrorCode.EXAM_ALREADY_STARTED]: 'This examination has already been started.',
      [ExaminationErrorCode.EXAM_ALREADY_COMPLETED]: 'This examination has already been completed.',
      [ExaminationErrorCode.EXAM_EXPIRED]: 'This examination has expired.',

      [ExaminationErrorCode.START_EXAM_FAILED]: 'Failed to start examination. Please try again.',
      [ExaminationErrorCode.TEMPLATE_NOT_FOUND]: 'Examination template not found.',
      [ExaminationErrorCode.NO_QUESTIONS_AVAILABLE]: 'No questions available for this examination.',

      [ExaminationErrorCode.SUBMIT_ANSWER_FAILED]: 'Failed to submit answer. Please try again.',
      [ExaminationErrorCode.SUBMIT_EXAM_FAILED]: 'Failed to submit examination. Please try again.',
      [ExaminationErrorCode.INVALID_ANSWER_FORMAT]: 'Invalid answer format. Please select a valid option.',

      [ExaminationErrorCode.QUESTION_NOT_FOUND]: 'Question not found.',
      [ExaminationErrorCode.INVALID_QUESTION_TYPE]: 'Invalid question type.',

      [ExaminationErrorCode.UNAUTHORIZED]: 'You are not authorized to access this examination.',
      [ExaminationErrorCode.FORBIDDEN]: 'Access denied to this examination.',
      [ExaminationErrorCode.SESSION_EXPIRED]: 'Your session has expired. Please login again.',

      [ExaminationErrorCode.TIME_EXPIRED]: 'Time has expired for this examination.',
      [ExaminationErrorCode.INVALID_TIME_SPENT]: 'Invalid time spent value.',
    };

    return errorMessages[this.code] || this.message;
  }
}

/**
 * Validation Error - for input validation failures
 */
export class ValidationError extends ExaminationError {
  constructor(message: string, details?: any) {
    super(message, ExaminationErrorCode.VALIDATION_ERROR, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Network Error - for connection/API failures
 */
export class NetworkError extends ExaminationError {
  constructor(message: string, details?: any) {
    super(message, ExaminationErrorCode.NETWORK_ERROR, 0, details);
    this.name = 'NetworkError';
  }
}

/**
 * Authorization Error - for authentication/authorization failures
 */
export class AuthorizationError extends ExaminationError {
  constructor(message: string, code: ExaminationErrorCode = ExaminationErrorCode.UNAUTHORIZED, details?: any) {
    super(message, code, 401, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Time Error - for time-related failures
 */
export class TimeError extends ExaminationError {
  constructor(message: string, details?: any) {
    super(message, ExaminationErrorCode.TIME_EXPIRED, 400, details);
    this.name = 'TimeError';
  }
}

/**
 * Helper function to create ExaminationError from any error
 */
export function createExaminationError(error: any): ExaminationError {
  if (error instanceof ExaminationError) {
    return error;
  }

  // Handle Axios errors
  if (error.response) {
    const statusCode = error.response.status;
    const message = error.response.data?.message || error.message || 'An error occurred';
    const details = error.response.data;

    // Map HTTP status codes to error codes
    let code = ExaminationErrorCode.UNKNOWN_ERROR;

    if (statusCode === 401) {
      code = ExaminationErrorCode.UNAUTHORIZED;
    } else if (statusCode === 403) {
      code = ExaminationErrorCode.FORBIDDEN;
    } else if (statusCode === 404) {
      code = ExaminationErrorCode.EXAM_NOT_FOUND;
    } else if (statusCode === 400) {
      code = ExaminationErrorCode.VALIDATION_ERROR;
    } else if (statusCode >= 500) {
      code = ExaminationErrorCode.UNKNOWN_ERROR;
    }

    return new ExaminationError(message, code, statusCode, details);
  }

  // Handle network errors
  if (error.request) {
    return new NetworkError('Network error. Please check your connection.', error);
  }

  // Default error
  return new ExaminationError(
    error.message || 'An unexpected error occurred',
    ExaminationErrorCode.UNKNOWN_ERROR,
    undefined,
    error,
  );
}
