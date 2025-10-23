import { useState, useCallback, useMemo } from 'react';

export interface UseExamNavigationOptions {
  totalQuestions: number;
  initialIndex?: number;
  onNavigate?: (index: number) => void;
}

export interface UseExamNavigationReturn {
  currentIndex: number;
  currentPage: number;
  totalPages: number;
  goToNext: () => void;
  goToPrevious: () => void;
  goToQuestion: (index: number) => void;
  goToPage: (page: number) => void;
  goToFirst: () => void;
  goToLast: () => void;
  isFirst: boolean;
  isLast: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progress: number;
}

/**
 * Custom hook for managing examination navigation
 * Provides navigation functionality for questions in an exam
 *
 * @param options - Navigation configuration options
 * @returns Navigation state and control functions
 *
 * @example
 * ```tsx
 * const {
 *   currentIndex,
 *   goToNext,
 *   goToPrevious,
 *   isFirst,
 *   isLast,
 *   progress
 * } = useExamNavigation({
 *   totalQuestions: 50,
 *   onNavigate: (index) => console.log(`Navigated to question ${index + 1}`),
 * });
 * ```
 */
export function useExamNavigation({
  totalQuestions,
  initialIndex = 0,
  onNavigate,
}: UseExamNavigationOptions): UseExamNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Validate initial index
    if (initialIndex < 0 || initialIndex >= totalQuestions) {
      return 0;
    }
    return initialIndex;
  });

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentIndex(index);
        if (onNavigate) {
          onNavigate(index);
        }
      }
    },
    [totalQuestions, onNavigate],
  );

  const goToNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (onNavigate) {
        onNavigate(nextIndex);
      }
    }
  }, [currentIndex, totalQuestions, onNavigate]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      if (onNavigate) {
        onNavigate(prevIndex);
      }
    }
  }, [currentIndex, onNavigate]);

  const goToFirst = useCallback(() => {
    if (currentIndex !== 0) {
      setCurrentIndex(0);
      if (onNavigate) {
        onNavigate(0);
      }
    }
  }, [currentIndex, onNavigate]);

  const goToLast = useCallback(() => {
    const lastIndex = totalQuestions - 1;
    if (currentIndex !== lastIndex) {
      setCurrentIndex(lastIndex);
      if (onNavigate) {
        onNavigate(lastIndex);
      }
    }
  }, [currentIndex, totalQuestions, onNavigate]);

  const goToPage = useCallback(
    (page: number) => {
      const index = page - 1;
      goToQuestion(index);
    },
    [goToQuestion],
  );

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const canGoNext = !isLast;
  const canGoPrevious = !isFirst;

  const currentPage = currentIndex + 1;
  const totalPages = totalQuestions;

  const progress = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return ((currentIndex + 1) / totalQuestions) * 100;
  }, [currentIndex, totalQuestions]);

  return {
    currentIndex,
    currentPage,
    totalPages,
    goToNext,
    goToPrevious,
    goToQuestion,
    goToPage,
    goToFirst,
    goToLast,
    isFirst,
    isLast,
    canGoNext,
    canGoPrevious,
    progress,
  };
}
