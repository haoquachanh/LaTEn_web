'use client';

/**
 * ErrorState Component
 *
 * A reusable component for displaying error states in the application,
 * with support for different error types and retry functionality.
 */
import React from 'react';

export type ErrorVariant = 'default' | 'inline' | 'card' | 'toast' | 'banner';
export type ErrorType = 'general' | 'network' | 'auth' | 'notFound' | 'validation' | 'server';

interface ErrorStateProps {
  /**
   * Error message to display
   */
  message?: string;

  /**
   * Error object
   */
  error?: Error | unknown;

  /**
   * Visual style variant
   */
  variant?: ErrorVariant;

  /**
   * Error type for customized styling
   */
  type?: ErrorType;

  /**
   * Optional retry function
   */
  onRetry?: () => void;

  /**
   * Custom CSS classes
   */
  className?: string;
}

/**
 * Get appropriate error icon based on error type
 */
function getErrorIcon(type: ErrorType): string {
  switch (type) {
    case 'network':
      return '📡';
    case 'auth':
      return '🔒';
    case 'notFound':
      return '🔍';
    case 'validation':
      return '📋';
    case 'server':
      return '🛠️';
    default:
      return '⚠️';
  }
}

/**
 * Get appropriate error title based on error type
 */
function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case 'network':
      return 'Network Error';
    case 'auth':
      return 'Authentication Error';
    case 'notFound':
      return 'Not Found';
    case 'validation':
      return 'Validation Error';
    case 'server':
      return 'Server Error';
    default:
      return 'Error';
  }
}

/**
 * Error State Component
 */
export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  error,
  variant = 'default',
  type = 'general',
  onRetry,
  className = '',
}: ErrorStateProps) {
  // Extract message from error if available and no message provided
  const errorMessage = !message && error instanceof Error ? error.message : message;
  const icon = getErrorIcon(type);
  const title = getErrorTitle(type);

  // Inline variant (horizontal alignment)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center text-error ${className}`}>
        <span className="mr-2">{icon}</span>
        <p>{errorMessage}</p>
        {onRetry && (
          <button onClick={onRetry} className="ml-3 underline text-sm" aria-label="Retry">
            Retry
          </button>
        )}
      </div>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`bg-error/10 border border-error/20 rounded-lg p-6 ${className}`}>
        <div className="flex flex-col items-center text-center">
          <span className="text-3xl mb-2">{icon}</span>
          <h3 className="font-bold text-lg text-error mb-2">{title}</h3>
          <p className="mb-4">{errorMessage}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn btn-sm btn-error" aria-label="Retry">
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <div className={`bg-error/10 border-l-4 border-error p-4 ${className}`}>
        <div className="flex items-center">
          <span className="text-xl mr-3">{icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-error">{title}</h3>
            <p>{errorMessage}</p>
          </div>
          {onRetry && (
            <button onClick={onRetry} className="btn btn-sm btn-error ml-4" aria-label="Retry">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default centered error state
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-center mb-4 max-w-md">{errorMessage}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-error" aria-label="Try again">
          Try Again
        </button>
      )}
    </div>
  );
}
