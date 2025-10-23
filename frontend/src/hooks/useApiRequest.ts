/**
 * useApiRequest Hook
 *
 * Custom hook for handling API requests with loading, error, and data states
 */
import { useState, useCallback } from 'react';
import { ApiError } from '@/services/unifiedApiClient';

interface UseApiRequestOptions<T> {
  /**
   * Initial data value
   */
  initialData?: T;

  /**
   * Callback on success
   */
  onSuccess?: (data: T) => void;

  /**
   * Callback on error
   */
  onError?: (error: ApiError) => void;

  /**
   * Show error notification
   */
  showErrorNotification?: boolean;
}

interface UseApiRequestReturn<T> {
  /**
   * Response data
   */
  data: T | null;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error state
   */
  error: ApiError | null;

  /**
   * Execute the request
   */
  execute: (...args: any[]) => Promise<T | null>;

  /**
   * Reset state
   */
  reset: () => void;

  /**
   * Set data manually
   */
  setData: (data: T | null) => void;
}

/**
 * Hook for handling API requests with automatic state management
 */
export function useApiRequest<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiRequestOptions<T> = {},
): UseApiRequestReturn<T> {
  const { initialData = null, onSuccess, onError, showErrorNotification = true } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const apiError: ApiError = {
          message: err instanceof Error ? err.message : 'An unexpected error occurred',
          statusCode: (err as any)?.statusCode || 500,
          errors: (err as any)?.errors,
          code: (err as any)?.code,
        };

        setError(apiError);

        if (onError) {
          onError(apiError);
        }

        if (showErrorNotification && typeof window !== 'undefined') {
          // You can integrate with a toast library here
          console.error('API Error:', apiError.message);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showErrorNotification],
  );

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
}

/**
 * Hook for handling multiple API requests
 */
export function useMultipleApiRequests<T extends Record<string, any>>(
  requests: Record<keyof T, () => Promise<any>>,
): {
  data: Partial<T>;
  loading: boolean;
  errors: Partial<Record<keyof T, ApiError>>;
  execute: () => Promise<void>;
  reset: () => void;
} {
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof T, ApiError>>>({});

  const execute = useCallback(async () => {
    setLoading(true);
    setErrors({});

    const results: Partial<T> = {};
    const errorResults: Partial<Record<keyof T, ApiError>> = {};

    await Promise.all(
      Object.entries(requests).map(async ([key, request]) => {
        try {
          results[key as keyof T] = await request();
        } catch (err) {
          errorResults[key as keyof T] = {
            message: err instanceof Error ? err.message : 'Request failed',
            statusCode: (err as any)?.statusCode || 500,
            errors: (err as any)?.errors,
            code: (err as any)?.code,
          };
        }
      }),
    );

    setData(results);
    setErrors(errorResults);
    setLoading(false);
  }, [requests]);

  const reset = useCallback(() => {
    setData({});
    setLoading(false);
    setErrors({});
  }, []);

  return {
    data,
    loading,
    errors,
    execute,
    reset,
  };
}
