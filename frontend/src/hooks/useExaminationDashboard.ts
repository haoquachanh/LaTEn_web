/**
 * Hook to use dashboard API with data persistence between navigations
 */
import { useExaminationDashboardContext } from '@/contexts/ExaminationDashboardContext';
import { DashboardResponse } from '@/services/examination-dashboard.service';
import { useCallback } from 'react';

/**
 * Custom hook to fetch aggregated dashboard data
 * Uses context to store data between renders and sessionStorage to persist between navigations
 */
export function useExaminationDashboard() {
  // Use context to manage state
  const { dashboardData, isLoading, error, refreshData } = useExaminationDashboardContext();

  /**
   * Utility function to clear cache when complete refresh is needed
   * Example: after completing a new examination
   */
  const clearCache = useCallback(() => {
    sessionStorage.removeItem('examination_dashboard_data');
    console.log('Cleared examination dashboard cache');
    // Refresh data after clearing cache
    refreshData();
  }, [refreshData]);

  return {
    data: dashboardData,
    isLoading,
    error,
    refreshData,
    clearCache,
  };
}
