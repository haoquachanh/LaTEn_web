'use client';

/**
 * LoadingState Component
 *
 * A reusable component for displaying loading states in the application,
 * with different variations for different contexts.
 */
import React from 'react';

export type LoadingVariant = 'default' | 'overlay' | 'inline' | 'card' | 'skeleton';
export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingStateProps {
  /**
   * Loading message to display
   */
  message?: string;

  /**
   * Visual style variant
   */
  variant?: LoadingVariant;

  /**
   * Size of the loading indicator
   */
  size?: LoadingSize;

  /**
   * Custom CSS classes
   */
  className?: string;

  /**
   * Whether to show a transparent overlay
   */
  overlay?: boolean;
}

/**
 * Get size in pixels based on the size prop
 */
function getSizeInPixels(size: LoadingSize): number {
  switch (size) {
    case 'sm':
      return 16;
    case 'md':
      return 24;
    case 'lg':
      return 32;
    case 'xl':
      return 48;
    default:
      return 24;
  }
}

/**
 * Loading State Component
 */
export default function LoadingState({
  message = 'Loading...',
  variant = 'default',
  size = 'md',
  className = '',
  overlay = false,
}: LoadingStateProps) {
  const sizeInPixels = getSizeInPixels(size);

  // Spinner component
  const Spinner = () => (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-primary`}
      style={{ width: sizeInPixels, height: sizeInPixels }}
    />
  );

  // Skeleton placeholder
  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  // Overlay spinner that covers the parent component
  if (overlay) {
    return (
      <div className="absolute inset-0 bg-base-100/80 flex items-center justify-center z-10">
        <div className="flex flex-col items-center">
          <Spinner />
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      </div>
    );
  }

  // Inline variant (horizontal alignment)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center ${className}`}>
        <Spinner />
        {message && <p className="ml-2">{message}</p>}
      </div>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`bg-base-200 rounded-lg p-8 shadow-sm ${className}`}>
        <div className="flex flex-col items-center">
          <Spinner />
          {message && <p className="mt-4 text-center">{message}</p>}
        </div>
      </div>
    );
  }

  // Default centered loading state
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <Spinner />
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
