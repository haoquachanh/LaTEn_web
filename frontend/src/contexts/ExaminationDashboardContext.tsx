'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import examinationDashboardService from '@/services/examination-dashboard.service';
import { DashboardResponse } from '@/services/examination-dashboard.service';

interface ExaminationDashboardContextType {
  dashboardData: DashboardResponse | null;
  isLoading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

// Default context value
const defaultContextValue: ExaminationDashboardContextType = {
  dashboardData: null,
  isLoading: true,
  error: null,
  refreshData: async () => {},
};

// Create context
const ExaminationDashboardContext = createContext<ExaminationDashboardContextType>(defaultContextValue);

// Provider component
export function ExaminationDashboardProvider({ children }: { children: ReactNode }) {
  // State for storing dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);

  // Restore data from sessionStorage when component mounts
  useEffect(() => {
    // Check if data exists in sessionStorage
    const savedData = sessionStorage.getItem('examination_dashboard_data');

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setDashboardData(parsedData);
        setHasLoadedOnce(true);
        console.log('Loaded examination dashboard data from session storage');
      } catch (err) {
        console.error('Error parsing saved dashboard data:', err);
        // If there's an error parsing, remove the data from sessionStorage
        sessionStorage.removeItem('examination_dashboard_data');
      }
    }
  }, []);

  // Only load data on first render or when necessary
  useEffect(() => {
    const fetchData = async () => {
      // If data has already been loaded, don't load again
      if (hasLoadedOnce && dashboardData !== null) {
        return;
      }

      try {
        setIsLoading(true);
        const data = await examinationDashboardService.getOptimizedDashboardData();
        setDashboardData(data);
        setHasLoadedOnce(true);
        setError(null);

        // Save data to sessionStorage to persist between navigations
        sessionStorage.setItem('examination_dashboard_data', JSON.stringify(data));
        console.log('Saved examination dashboard data to session storage');
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hasLoadedOnce, dashboardData]);

  // Function to force data refresh when needed
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const data = await examinationDashboardService.getDashboardData();
      setDashboardData(data);

      // Update data in sessionStorage
      sessionStorage.setItem('examination_dashboard_data', JSON.stringify(data));
      console.log('Updated examination dashboard data in session storage');

      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExaminationDashboardContext.Provider
      value={{
        dashboardData,
        isLoading,
        error,
        refreshData,
      }}
    >
      {children}
    </ExaminationDashboardContext.Provider>
  );
}

// Custom hook để sử dụng ExaminationDashboardContext
export function useExaminationDashboardContext() {
  const context = useContext(ExaminationDashboardContext);

  if (context === undefined) {
    throw new Error('useExaminationDashboardContext must be used within an ExaminationDashboardProvider');
  }

  return context;
}
