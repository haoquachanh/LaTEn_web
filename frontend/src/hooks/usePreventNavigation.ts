'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useExamContext } from '@/contexts/ExamContext';

/**
 * Hook to prevent navigation during exams using window.onbeforeunload
 * and router events
 *
 * @param message - Optional custom message for the browser's confirmation dialog
 */
export const usePreventNavigation = (
  message = 'You have an exam in progress. Are you sure you want to leave? Your progress may be lost.',
) => {
  const router = useRouter();
  const { examInProgress, shouldBlockNavigation } = useExamContext();

  // Add beforeunload event listener to handle browser navigation, refresh, tab close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldBlockNavigation || !examInProgress) return;

      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    if (shouldBlockNavigation && examInProgress) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlockNavigation, examInProgress, message]);

  return {
    examInProgress,
    shouldBlockNavigation,
  };
};

export default usePreventNavigation;
