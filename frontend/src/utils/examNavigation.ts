'use client';

import { usePathname } from 'next/navigation';

// List of routes that should trigger an exam navigation confirmation
const EXAM_ROUTES = [
  '/examination/exam',
  '/examination/quiz',
  '/examination/test',
  // Add other exam routes here
];

/**
 * Check if the current path is an exam route
 * @param path Current path to check
 * @returns boolean
 */
export const isExamRoute = (path: string): boolean => {
  // Remove locale prefix if present (e.g. /en/examination/exam -> /examination/exam)
  const normalizedPath = path.replace(/^\/(vi|en)/, '');

  return EXAM_ROUTES.some((route) => normalizedPath.startsWith(route));
};

/**
 * Hook to check if we're currently on an exam route
 * @returns boolean
 */
export const useIsExamRoute = (): boolean => {
  const pathname = usePathname();
  return isExamRoute(pathname);
};

/**
 * Check if a route change should be blocked due to an exam in progress
 * @returns Function to check if navigation should be blocked
 */
export const useExamNavigationBlocker = () => {
  const isCurrentlyInExam = useIsExamRoute();

  return (targetPath: string): boolean => {
    // If we're in an exam and trying to navigate away
    if (isCurrentlyInExam && !isExamRoute(targetPath)) {
      // Check global flag
      if (typeof window !== 'undefined' && (window as any).__EXAM_IN_PROGRESS) {
        return true; // Should block navigation
      }

      // Check sessionStorage as a fallback
      if (
        typeof window !== 'undefined' &&
        (sessionStorage.getItem('exam-type') || sessionStorage.getItem('exam-content'))
      ) {
        return true; // Should block navigation
      }
    }

    return false; // Don't block navigation
  };
};
