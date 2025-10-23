import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseExamTimerOptions {
  initialTime: number;
  onTimeUp?: () => void;
  onTick?: (timeRemaining: number) => void;
  autoStart?: boolean;
}

export interface UseExamTimerReturn {
  timeRemaining: number;
  isPaused: boolean;
  isRunning: boolean;
  isFinished: boolean;
  pause: () => void;
  resume: () => void;
  reset: (newTime?: number) => void;
  start: () => void;
  stop: () => void;
  addTime: (seconds: number) => void;
  formatTime: (seconds?: number) => string;
}

/**
 * Custom hook for managing examination timer
 * Provides timer functionality with pause, resume, reset capabilities
 *
 * @param options - Timer configuration options
 * @returns Timer state and control functions
 *
 * @example
 * ```tsx
 * const { timeRemaining, isPaused, pause, resume, formatTime } = useExamTimer({
 *   initialTime: 3600, // 1 hour
 *   onTimeUp: () => console.log('Time is up!'),
 *   autoStart: true,
 * });
 * ```
 */
export function useExamTimer({
  initialTime,
  onTimeUp,
  onTick,
  autoStart = false,
}: UseExamTimerOptions): UseExamTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  const onTickRef = useRef(onTick);

  // Keep refs updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
    onTickRef.current = onTick;
  }, [onTimeUp, onTick]);

  // Timer effect
  useEffect(() => {
    if (!isRunning || isPaused || timeRemaining <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Call onTick callback
        if (onTickRef.current) {
          onTickRef.current(newTime);
        }

        if (newTime <= 0) {
          // Call onTimeUp callback
          if (onTimeUpRef.current) {
            onTimeUpRef.current();
          }
          setIsRunning(false);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, timeRemaining]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (timeRemaining > 0) {
      setIsPaused(false);
      setIsRunning(true);
    }
  }, [timeRemaining]);

  const reset = useCallback(
    (newTime?: number) => {
      setTimeRemaining(newTime ?? initialTime);
      setIsPaused(true);
      setIsRunning(false);
    },
    [initialTime],
  );

  const start = useCallback(() => {
    setIsPaused(false);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsPaused(true);
    setIsRunning(false);
    setTimeRemaining(0);
  }, []);

  const addTime = useCallback((seconds: number) => {
    setTimeRemaining((prev) => Math.max(0, prev + seconds));
  }, []);

  const formatTime = useCallback(
    (seconds?: number): string => {
      const time = seconds ?? timeRemaining;
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const secs = time % 60;

      if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    [timeRemaining],
  );

  const isFinished = timeRemaining === 0;

  return {
    timeRemaining,
    isPaused,
    isRunning,
    isFinished,
    pause,
    resume,
    reset,
    start,
    stop,
    addTime,
    formatTime,
  };
}
