'use client';

/**
 * Examination Context
 *
 * Enterprise-grade React context for managing examination state
 * including timer, answers, and navigation.
 */
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import examinationAttemptService from '@/services/examination-attempt.service';
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
  answers: Record<string, string | number>; // Cập nhật kiểu dữ liệu phù hợp hơn
  isSubmitting: boolean;
  result: ExaminationResult | null;

  // Actions
  loadExamination: (id: number | string) => Promise<Examination>;
  startExamination: (templateId: number | string) => Promise<Examination>; // Đơn giản hóa interface
  submitExamination: () => Promise<ExaminationResult | undefined>;
  handleAnswer: (questionId: string, selectedOption: string | number) => void; // Cập nhật kiểu dữ liệu
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
  startExamination: async (templateId: number | string) => ({}) as Examination,
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
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ExaminationResult | null>(null);

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
   * Countdown timer with proper cleanup
   */
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (timeRemaining > 0 && currentExam && !result) {
      intervalId = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer reached zero, will trigger auto-submit in another effect
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup function - always clear interval when dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timeRemaining, currentExam, result]);

  /**
   * Auto-submit effect when time runs out
   */
  const loadExamination = useCallback(
    async (id: number | string) => {
      try {
        const examDetail = await examinationAttemptService.getExaminationDetail(id);

        // Transform the ExaminationResult to a compatible Examination type
        const transformedExam: Examination = {
          id: examDetail.id,
          title: examDetail.examination?.title || 'Untitled Examination',
          description: examDetail.examination?.description || '',
          type: examDetail.examination?.type || 'multiple',
          level: examDetail.examination?.level || 'medium',
          duration: Math.ceil(examDetail.timeSpent / 60),
          durationSeconds: examDetail.timeSpent,
          totalQuestions: examDetail.totalQuestions,
          questions:
            examDetail.detailedResults?.map((detail) => ({
              id: detail.questionId.toString(),
              question: 'Question content', // Default value
              options: [],
              correctAnswer: detail.correctOption?.toString() || '',
              type: 'multiple_choice',
              content: 'text',
            })) || [],
          score: examDetail.score,
          createdAt: examDetail.examination?.createdAt || new Date().toISOString(),
          updatedAt: examDetail.updatedAt,
        };

        setCurrentExam(transformedExam);
        return transformedExam;
      } catch (error) {
        console.error('Error loading examination:', error);
        showToast('Error loading examination', 'error');
        throw error;
      }
    },
    [showToast],
  );

  /**
   * Start an examination from a template
   */
  const startExamination = useCallback(
    async (templateId: number | string) => {
      try {
        setIsSubmitting(false);
        setResult(null);
        setAnswers({});
        setCurrentPage(0);

        console.log(`Context: Starting examination with template ID ${templateId}`);

        // Bắt đầu bài thi từ template
        const exam = await examinationAttemptService.startExamination(templateId);
        console.log('Context: Examination data received:', exam);

        setCurrentExam(exam);

        // Chuyển đổi examinationQuestions thành questions
        if (exam.examinationQuestions && exam.examinationQuestions.length > 0) {
          const mappedQuestions = exam.examinationQuestions.map((eq: any) => {
            const q = eq.question;

            // Xử lý options dựa vào loại câu hỏi
            let options = [];
            if (q.type === 'true_false') {
              options = ['true', 'false'];
            } else if (q.type === 'multiple_choice' && q.options?.length > 0) {
              options = q.options.map((opt: any) => opt.content || opt.text || '');
            }

            return {
              id: eq.id.toString(),
              question: q.content || '',
              answers: options,
              correctAnswer: '', // Ẩn đáp án đúng trong quá trình làm bài
              type: q.type || '',
              content: q.content || '',
              questionId: q.id,
              examinationQuestionId: eq.id,
            };
          });

          console.log(`Context: ${mappedQuestions.length} questions loaded`);
          setQuestions(mappedQuestions);
        } else {
          console.error('Context: No questions received from API');
          showToast('Error: No questions available for this examination', 'error');
        }

        // Thiết lập thời gian làm bài
        const durationInSeconds = exam.durationSeconds || (exam.duration ? exam.duration * 60 : 3600);
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

      console.log('Preparing to submit exam answers');

      // Calculate time spent
      const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : totalTime - timeRemaining;

      console.log('Time spent:', timeSpent);
      console.log('Answers:', answers);

      // Gửi từng câu trả lời
      for (const questionId in answers) {
        await examinationAttemptService.submitAnswer(currentExam.id, questionId, answers[questionId]);
      }

      // Hoàn thành bài thi
      const examResult = await examinationAttemptService.completeExamination(currentExam.id);

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
  const handleAnswer = useCallback((questionId: string, selectedOption: string | number) => {
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
  }, []);

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
