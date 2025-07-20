/**
 * Data Fetching Hooks
 *
 * Centralized data fetching hooks using SWR with optimized configuration,
 * caching, revalidation, and error handling.
 */
import { useCallback } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import useSWRInfinite from 'swr/infinite';
import api from '../services/api';
import { ApiResponse, PaginatedResponse } from '../services/types/api.types';
import { displayErrorToast } from '../utils/errorHandling';

// Default SWR configuration
const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  dedupingInterval: 5000, // 5 seconds
};

/**
 * Custom fetcher function with error handling
 */
const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await api.get<ApiResponse<T>>(url);
    return response.data.data;
  } catch (error) {
    // Convert API error to a format SWR can understand
    throw displayErrorToast(error);
  }
};

/**
 * Hook for simple data fetching with SWR
 */
export function useApiQuery<T = any>(url: string | null, config: SWRConfiguration = {}): SWRResponse<T, Error> {
  return useSWR<T, Error>(url, fetcher, { ...defaultConfig, ...config });
}

/**
 * Hook for paginated data fetching
 */
export function usePaginatedQuery<T = any>(
  baseUrl: string,
  page: number = 1,
  limit: number = 10,
  filters: Record<string, any> = {},
  config: SWRConfiguration = {},
): SWRResponse<PaginatedResponse<T>, Error> {
  // Build query params
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });

  const url = `${baseUrl}?${queryParams.toString()}`;

  return useSWR<PaginatedResponse<T>, Error>(url, fetcher, { ...defaultConfig, ...config });
}

/**
 * Hook for mutation operations (create, update, delete)
 */
export function useApiMutation<T = any, R = any>(url: string) {
  // Define mutate function that matches SWR's expected pattern
  const fetcher = async (url: string, { arg }: { arg: T }) => {
    try {
      const response = await api.post<ApiResponse<R>>(url, arg);
      return response.data.data;
    } catch (error) {
      throw displayErrorToast(error);
    }
  };

  return useSWRMutation<R, Error, string, T>(url, fetcher);
}

/**
 * Hook for infinite scrolling data
 */
export function useInfiniteQuery<T = any>(
  baseUrl: string,
  limit: number = 10,
  filters: Record<string, any> = {},
  config: SWRConfiguration = {},
) {
  // Generate page keys for infinite loading
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<T> | null) => {
    // Reached the end
    if (previousPageData && !previousPageData.hasNext) return null;

    // First page
    if (pageIndex === 0) {
      const queryParams = new URLSearchParams({
        page: '1',
        limit: limit.toString(),
        ...filters,
      });
      return `${baseUrl}?${queryParams.toString()}`;
    }

    // Add the cursor to the API endpoint
    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      limit: limit.toString(),
      ...filters,
    });
    return `${baseUrl}?${queryParams.toString()}`;
  };

  return useSWRInfinite<PaginatedResponse<T>, Error>(getKey, fetcher, { ...defaultConfig, ...config });
}

/**
 * Hook for data fetching with auto-refresh
 */
export function usePolledQuery<T = any>(
  url: string | null,
  interval: number = 5000, // 5 seconds
  config: SWRConfiguration = {},
): SWRResponse<T, Error> {
  return useSWR<T, Error>(url, fetcher, {
    ...defaultConfig,
    ...config,
    refreshInterval: interval,
  });
}

/**
 * Hook for conditional data fetching
 */
export function useConditionalQuery<T = any>(
  shouldFetch: boolean,
  url: string,
  config: SWRConfiguration = {},
): SWRResponse<T, Error> {
  return useSWR<T, Error>(shouldFetch ? url : null, fetcher, { ...defaultConfig, ...config });
}
