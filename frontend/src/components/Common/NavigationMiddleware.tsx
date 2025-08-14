'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useExamContext } from '@/contexts/ExamContext';

/**
 * This component provides navigation blocking middleware for routes that should not
 * be navigated away from without confirmation (like exams).
 */
const NavigationMiddleware = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { examInProgress, shouldBlockNavigation } = useExamContext();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Track the current URL for comparison
  const [lastPathUrl, setLastPathUrl] = useState('');
  const currentPathUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

  useEffect(() => {
    setLastPathUrl(currentPathUrl);
  }, [currentPathUrl]);

  // Warn user when closing tab or refreshing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!examInProgress || !shouldBlockNavigation) return;

      const message = 'You have an exam in progress. Are you sure you want to leave?';
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    if (examInProgress && shouldBlockNavigation) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examInProgress, shouldBlockNavigation]);

  return null;
};

export default NavigationMiddleware;
