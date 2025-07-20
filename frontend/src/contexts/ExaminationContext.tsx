'use client';

/**
 * Examination Context
 *
 * Enterprise-grade React context for managing examination state
 * including timer, answers, and navigation.
 */
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import examinationService from '@/services/examination.service';
import {
  Examination,
  ExaminationAnswer,
  ExaminationResult,
  ExaminationSubmission,
  Question,
} from '@/services/types/examination.types';
import { useToast } from '@/hooks/useToast';

/**
 * Examination context interface
 */
interface ExaminationContextProps {
  // State properties
  currentExam: Examination | null;
  questions: Question[];
  currentPage: number;
  totalPages: number;
  timeRemaining: number;
  totalTime: number;
  answers: Record<number, number>;
  isSubmitting: boolean;
  result: ExaminationResult | null;

  // Actions
  loadExamination: (id: number | string) => Promise<Examination>;
  startExamination: (id: number | string) => Promise<Examination>;
  submitExamination: () => Promise<ExaminationResult | undefined>;
  handleAnswer: (questionId: number, selectedOption: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetExamination: () => void;
}

// Create context with default values
const ExaminationContext = createContext<ExaminationContextProps>({
  currentExam: null,
  questions: [],
  currentPage: 0,
  totalPages: 0,
  timeRemaining: 0,
  totalTime: 0,
  answers: {},
  isSubmitting: false,
  result: null,

  loadExamination: async (id: number | string) => ({}) as Examination,
  startExamination: async (id: number | string) => ({}) as Examination,
  submitExamination: async () => undefined,
  handleAnswer: () => {},
  goToPage: () => {},
  nextPage: () => {},
  previousPage: () => {},
  resetExamination: () => {},
});

interface Props {
  children: ReactNode;
}

/**
 * Provider component for examination context
 */
export function ExaminationProvider({ children }: Props) {
  // State
  const [currentExam, setCurrentExam] = useState<Examination | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [questionsPerPage, setQuestionsPerPage] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ExaminationResult | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // Hooks
  const router = useRouter();
  const { showToast } = useToast();

  // Calculated properties
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  /**
   * Set up responsive questionsPerPage
   */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setQuestionsPerPage(3);
      } else if (width >= 768) {
        setQuestionsPerPage(2);
      } else {
        setQuestionsPerPage(1);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * Countdown timer
   */
  useEffect(() => {
    if (timeRemaining > 0 && currentExam && !result) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      setTimerId(timer);
      return () => clearTimeout(timer);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timeRemaining, currentExam, result, timerId]);

  /**
   * Clean up timer when component unmounts
   */
  useEffect(() => {
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timerId]);

  /**
   * Load examination details
   */
  const loadExamination = useCallback(
    async (id: number | string) => {
      try {
        const exam = await examinationService.getExaminationById(id);
        setCurrentExam(exam);
        return exam;
      } catch (error) {
        console.error('Error loading examination:', error);
        showToast('Error loading examination', 'error');
        throw error;
      }
    },
    [showToast],
  );

  /**
   * Start an examination
   */
  const startExamination = useCallback(
    async (id: number | string) => {
      try {
        setIsSubmitting(false);
        setResult(null);
        setAnswers({});
        setCurrentPage(0);

        // Load exam with questions
        const exam = await examinationService.startExamination(id);
        setCurrentExam(exam);
        if (exam.questions) {
          setQuestions(exam.questions);
        }

        // Set up timer
        const durationInSeconds = exam.duration * 60;
        setTimeRemaining(durationInSeconds);
        setTotalTime(durationInSeconds);
        setStartTime(new Date());

        return exam;
      } catch (error) {
        console.error('Error starting examination:', error);
        showToast('Error starting examination', 'error');
        throw error;
      }
    },
    [showToast],
  );

  /**
   * Submit examination answers
   */
  const submitExamination = useCallback(async () => {
    if (!currentExam || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Prepare answers array
      const answerArray: ExaminationAnswer[] = Object.keys(answers).map((questionId) => ({
        questionId: parseInt(questionId),
        selectedOption: answers[parseInt(questionId)],
      }));

      // Calculate time spent
      const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : totalTime - timeRemaining;

      // Submit answers
      const submission: ExaminationSubmission = {
        answers: answerArray,
        timeSpent,
      };

      const examResult = await examinationService.submitExamination(currentExam.id, submission);

      setResult(examResult);
      showToast('Examination submitted successfully', 'success');

      return examResult;
    } catch (error) {
      console.error('Error submitting examination:', error);
      showToast('Error submitting examination', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentExam, isSubmitting, answers, startTime, timeRemaining, totalTime, showToast]);

  /**
   * Auto-submit effect when time runs out
   */
  useEffect(() => {
    if (timeRemaining === 0 && currentExam && !result && !isSubmitting) {
      const autoSubmit = async () => {
        try {
          await submitExamination();
        } catch (error) {
          console.error('Error auto-submitting examination:', error);
        }
      };
      autoSubmit();
    }
  }, [timeRemaining, currentExam, result, isSubmitting, submitExamination]);

  /**
   * Handle answering a question
   */
  const handleAnswer = useCallback((questionId: number, selectedOption: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  }, []);

  /**
   * Navigate to a specific page
   */
  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  /**
   * Reset examination state
   */
  const resetExamination = useCallback(() => {
    setCurrentExam(null);
    setQuestions([]);
    setCurrentPage(0);
    setTimeRemaining(0);
    setTotalTime(0);
    setStartTime(null);
    setAnswers({});
    setIsSubmitting(false);
    setResult(null);

    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  }, [timerId]);

  const value = {
    currentExam,
    questions,
    currentPage,
    totalPages,
    timeRemaining,
    totalTime,
    answers,
    isSubmitting,
    result,

    loadExamination,
    startExamination,
    submitExamination,
    handleAnswer,
    goToPage,
    nextPage,
    previousPage,
    resetExamination,
  };

  return <ExaminationContext.Provider value={value}>{children}</ExaminationContext.Provider>;
}

export { ExaminationContext };
