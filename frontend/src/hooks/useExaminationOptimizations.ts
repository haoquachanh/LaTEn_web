/**
 * Optimized hooks for Examination components
 * Performance optimizations with useMemo and useCallback
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { Question } from '@/services/types/examination.types';
import { TIMER_INTERVAL_MS } from '@/constants/examination.constants';

/**
 * Hook for optimized exam results data
 * Creates a Map for O(1) lookup instead of O(n) search
 */
export function useExamResultsMap(
  detailedResults?: Array<{
    questionId?: number;
    examinationQuestionId?: number;
    isCorrect: boolean;
    selectedOption: number | string | null;
    correctOption: number | string | null;
    question?: Question;
  }>,
) {
  const resultsMap = useMemo(() => {
    const map = new Map<string, any>();

    if (!detailedResults || detailedResults.length === 0) {
      return map;
    }

    detailedResults.forEach((result) => {
      const key = result.questionId?.toString() || result.examinationQuestionId?.toString();
      if (key) {
        map.set(key, result);
      }
    });

    return map;
  }, [detailedResults]);

  const getResult = useCallback(
    (questionId: string) => {
      return resultsMap.get(questionId);
    },
    [resultsMap],
  );

  return { resultsMap, getResult };
}

/**
 * Hook for optimized question navigation
 */
export function useQuestionNavigation(totalQuestions: number, initialIndex: number = 0) {
  const currentIndexRef = useRef(initialIndex);

  const canGoNext = useMemo(() => currentIndexRef.current < totalQuestions - 1, [totalQuestions]);

  const canGoPrevious = useMemo(() => currentIndexRef.current > 0, []);

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        currentIndexRef.current = index;
        return index;
      }
      return currentIndexRef.current;
    },
    [totalQuestions],
  );

  const goNext = useCallback(() => {
    if (currentIndexRef.current < totalQuestions - 1) {
      currentIndexRef.current += 1;
      return currentIndexRef.current;
    }
    return currentIndexRef.current;
  }, [totalQuestions]);

  const goPrevious = useCallback(() => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1;
      return currentIndexRef.current;
    }
    return currentIndexRef.current;
  }, []);

  return {
    currentIndex: currentIndexRef.current,
    canGoNext,
    canGoPrevious,
    goToQuestion,
    goNext,
    goPrevious,
  };
}

/**
 * Hook for exam timer with proper cleanup
 * Prevents memory leaks and uses refs for stable callbacks
 */
export function useExamTimer(durationSeconds: number, onTimeExpired: () => void, autoStart: boolean = true) {
  const timeLeftRef = useRef(durationSeconds);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeExpiredRef = useRef(onTimeExpired);

  // Update callback ref when it changes
  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired;
  }, [onTimeExpired]);

  // Initialize time
  useEffect(() => {
    timeLeftRef.current = durationSeconds;
  }, [durationSeconds]);

  const startTimer = useCallback(() => {
    if (timerIdRef.current) return; // Already running

    timerIdRef.current = setInterval(() => {
      timeLeftRef.current -= 1;

      if (timeLeftRef.current <= 0) {
        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
        }
        onTimeExpiredRef.current();
      }
    }, TIMER_INTERVAL_MS);
  }, []);

  const pauseTimer = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(
    (newDuration?: number) => {
      pauseTimer();
      timeLeftRef.current = newDuration ?? durationSeconds;
    },
    [durationSeconds, pauseTimer],
  );

  const getTimeLeft = useCallback(() => timeLeftRef.current, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startTimer();
    }

    // Cleanup on unmount
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [autoStart, startTimer]);

  return {
    timeLeft: timeLeftRef.current,
    startTimer,
    pauseTimer,
    resetTimer,
    getTimeLeft,
    isRunning: timerIdRef.current !== null,
  };
}

/**
 * Hook for answer tracking with optimization
 */
export function useAnswerTracking(questions: Question[], initialAnswers: Record<string, string> = {}) {
  const answersRef = useRef<Record<string, string>>(initialAnswers);

  const answeredCount = useMemo(() => {
    return Object.keys(answersRef.current).length;
  }, []); // Empty deps - will be calculated once

  const unansweredQuestions = useMemo(() => {
    return questions.filter((q) => !answersRef.current[String(q.id)]);
  }, [questions]); // Depend on questions array

  const setAnswer = useCallback((questionId: string, answer: string) => {
    answersRef.current[questionId] = answer;
  }, []);

  const getAnswer = useCallback((questionId: string) => {
    return answersRef.current[questionId];
  }, []);

  const clearAnswer = useCallback((questionId: string) => {
    delete answersRef.current[questionId];
  }, []);

  const clearAllAnswers = useCallback(() => {
    answersRef.current = {};
  }, []);

  const hasAnswer = useCallback((questionId: string) => {
    return questionId in answersRef.current;
  }, []);

  return {
    answers: answersRef.current,
    answeredCount,
    unansweredQuestions,
    setAnswer,
    getAnswer,
    clearAnswer,
    clearAllAnswers,
    hasAnswer,
  };
}

/**
 * Hook for question filtering and sorting
 */
export function useQuestionFiltering(
  questions: Question[],
  userAnswers: Record<string, string>,
  flaggedQuestions: string[],
) {
  const answeredQuestions = useMemo(() => {
    return questions.filter((q) => q.id in userAnswers);
  }, [questions, userAnswers]);

  const unansweredQuestions = useMemo(() => {
    return questions.filter((q) => !(q.id in userAnswers));
  }, [questions, userAnswers]);

  const flaggedQuestionsList = useMemo(() => {
    return questions.filter((q) => flaggedQuestions.includes(String(q.id)));
  }, [questions, flaggedQuestions]);

  const progress = useMemo(() => {
    const total = questions.length;
    const answered = answeredQuestions.length;
    const flagged = flaggedQuestions.length;

    return {
      total,
      answered,
      unanswered: total - answered,
      flagged,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
    };
  }, [questions.length, answeredQuestions.length, flaggedQuestions.length]);

  return {
    answeredQuestions,
    unansweredQuestions,
    flaggedQuestionsList,
    progress,
  };
}

/**
 * Hook for debounced auto-save
 */
export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => void | Promise<void>,
  delay: number = 30000, // 30 seconds default
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onSaveRef.current(data);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay]);

  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSaveRef.current(data);
  }, [data]);

  return { saveNow };
}
