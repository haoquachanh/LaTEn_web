'use client';

/**
 * Examination Hook
 *
 * Custom hook for accessing the examination context.
 * This hook provides access to examination state and methods.
 */
import { useContext } from 'react';
import { ExaminationContext } from '@/contexts/ExaminationContext';

/**
 * Custom hook to use the examination context
 *
 * @returns Examination context value
 */
export function useExamination() {
  const context = useContext(ExaminationContext);

  if (context === undefined) {
    throw new Error('useExamination must be used within an ExaminationProvider');
  }

  return context;
}

export default useExamination;
