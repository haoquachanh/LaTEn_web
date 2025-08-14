'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useExamContext } from '@/contexts/ExamContext';
import { useExamNavigationBlocker } from '@/utils/examNavigation';

/**
 * Custom hook to handle navigation confirmation during exams
 * @returns Object with state and methods for navigation confirmation
 */
export const useConfirmNavigation = () => {
  const { examInProgress, shouldBlockNavigation } = useExamContext();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  const shouldBlockNavigationFn = useExamNavigationBlocker();

  // Handle beforeunload event (browser tab close, refresh, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldBlockNavigation || !examInProgress) return;
      
      const message = 'You have an exam in progress. Are you sure you want to leave?';
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
  }, [shouldBlockNavigation, examInProgress]);

  // Method to attempt navigation
  const attemptNavigation = (path: string) => {
    // Check if we should block navigation
    if (shouldBlockNavigation && examInProgress && shouldBlockNavigationFn(path)) {
      // Set the pending navigation and show the confirmation dialog
      setPendingNavigation(path);
      setShowConfirmation(true);
      return false;
    }
    
    // No need to block, navigate directly
    router.push(path);
    return true;
  };

  // Method to confirm navigation
  const confirmNavigation = () => {
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setShowConfirmation(false);
      setPendingNavigation(null);
    }
  };

  // Method to cancel navigation
  const cancelNavigation = () => {
    setShowConfirmation(false);
    setPendingNavigation(null);
  };

  return {
    showConfirmation,
    attemptNavigation,
    confirmNavigation,
    cancelNavigation,
    shouldBlockNavigation,
    examInProgress
  };
};

export default useConfirmNavigation;