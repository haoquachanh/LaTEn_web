/**
 * Examination State Management with useReducer
 * Centralized state management for examination flow
 */

import { useReducer, useCallback } from 'react';
import { Question, ExaminationResult } from '@/services/types/examination.types';

/**
 * Examination configuration
 */
export interface ExamConfig {
  type: 'multiple' | 'true-false' | 'essay' | 'mixed';
  content: 'reading' | 'listening' | 'grammar' | 'vocabulary' | 'mixed';
  timeInMinutes: number;
  questionsCount: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Examination state interface
 */
export interface ExaminationState {
  // Current stage in examination flow
  stage: 'dashboard' | 'setup' | 'inProgress' | 'results';

  // Questions and answers
  selectedQuestions: Question[];
  userAnswers: Record<string, string>;
  flaggedQuestions: string[];

  // Configuration
  config: ExamConfig;

  // Mode settings
  mode: {
    isCustom: boolean;
    selectedPresetId: string;
  };

  // Results
  results: ExaminationResult | null;

  // Current examination metadata
  currentExaminationId: number | null;
  startedAt: string | null;
  timeRemaining: number | null; // in seconds

  // UI state
  ui: {
    isLoading: boolean;
    error: string | null;
    currentQuestionIndex: number;
  };
}

/**
 * Examination actions
 */
export type ExaminationAction =
  // Stage management
  | { type: 'SET_STAGE'; payload: ExaminationState['stage'] }
  | { type: 'RESET_EXAM' }

  // Questions management
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'CLEAR_QUESTIONS' }

  // Answers management
  | { type: 'SUBMIT_ANSWER'; payload: { questionId: string; answer: string } }
  | { type: 'CLEAR_ANSWERS' }
  | { type: 'FLAG_QUESTION'; payload: string }
  | { type: 'UNFLAG_QUESTION'; payload: string }
  | { type: 'TOGGLE_FLAG_QUESTION'; payload: string }

  // Configuration management
  | { type: 'UPDATE_CONFIG'; payload: Partial<ExamConfig> }
  | { type: 'SET_CONFIG'; payload: ExamConfig }

  // Mode management
  | { type: 'SET_MODE'; payload: { isCustom: boolean; selectedPresetId?: string } }

  // Results management
  | { type: 'SET_RESULTS'; payload: ExaminationResult }
  | { type: 'CLEAR_RESULTS' }

  // Examination metadata
  | { type: 'START_EXAMINATION'; payload: { id: number; startedAt: string; durationSeconds: number } }
  | { type: 'UPDATE_TIME_REMAINING'; payload: number }
  | { type: 'COMPLETE_EXAMINATION' }

  // UI management
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_QUESTION_INDEX'; payload: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' };

/**
 * Initial state
 */
export const initialExaminationState: ExaminationState = {
  stage: 'dashboard',
  selectedQuestions: [],
  userAnswers: {},
  flaggedQuestions: [],
  config: {
    type: 'multiple',
    content: 'reading',
    timeInMinutes: 30,
    questionsCount: 10,
    level: 'intermediate',
  },
  mode: {
    isCustom: true,
    selectedPresetId: '',
  },
  results: null,
  currentExaminationId: null,
  startedAt: null,
  timeRemaining: null,
  ui: {
    isLoading: false,
    error: null,
    currentQuestionIndex: 0,
  },
};

/**
 * Examination reducer
 */
export function examinationReducer(state: ExaminationState, action: ExaminationAction): ExaminationState {
  switch (action.type) {
    // Stage management
    case 'SET_STAGE':
      return {
        ...state,
        stage: action.payload,
        ui: { ...state.ui, error: null },
      };

    case 'RESET_EXAM':
      return {
        ...initialExaminationState,
        mode: state.mode, // Keep mode settings
        config: state.config, // Keep config settings
      };

    // Questions management
    case 'SET_QUESTIONS':
      return {
        ...state,
        selectedQuestions: action.payload,
        userAnswers: {},
        flaggedQuestions: [],
        ui: { ...state.ui, currentQuestionIndex: 0 },
      };

    case 'CLEAR_QUESTIONS':
      return {
        ...state,
        selectedQuestions: [],
        userAnswers: {},
        flaggedQuestions: [],
        ui: { ...state.ui, currentQuestionIndex: 0 },
      };

    // Answers management
    case 'SUBMIT_ANSWER':
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.payload.questionId]: action.payload.answer,
        },
      };

    case 'CLEAR_ANSWERS':
      return {
        ...state,
        userAnswers: {},
      };

    case 'FLAG_QUESTION':
      if (state.flaggedQuestions.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        flaggedQuestions: [...state.flaggedQuestions, action.payload],
      };

    case 'UNFLAG_QUESTION':
      return {
        ...state,
        flaggedQuestions: state.flaggedQuestions.filter((id) => id !== action.payload),
      };

    case 'TOGGLE_FLAG_QUESTION':
      return {
        ...state,
        flaggedQuestions: state.flaggedQuestions.includes(action.payload)
          ? state.flaggedQuestions.filter((id) => id !== action.payload)
          : [...state.flaggedQuestions, action.payload],
      };

    // Configuration management
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };

    case 'SET_CONFIG':
      return {
        ...state,
        config: action.payload,
      };

    // Mode management
    case 'SET_MODE':
      return {
        ...state,
        mode: {
          isCustom: action.payload.isCustom,
          selectedPresetId: action.payload.selectedPresetId || '',
        },
      };

    // Results management
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        stage: 'results',
        ui: { ...state.ui, isLoading: false },
      };

    case 'CLEAR_RESULTS':
      return {
        ...state,
        results: null,
      };

    // Examination metadata
    case 'START_EXAMINATION':
      return {
        ...state,
        currentExaminationId: action.payload.id,
        startedAt: action.payload.startedAt,
        timeRemaining: action.payload.durationSeconds,
        stage: 'inProgress',
        ui: { ...state.ui, isLoading: false, currentQuestionIndex: 0 },
      };

    case 'UPDATE_TIME_REMAINING':
      return {
        ...state,
        timeRemaining: action.payload,
      };

    case 'COMPLETE_EXAMINATION':
      return {
        ...state,
        timeRemaining: 0,
      };

    // UI management
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, isLoading: action.payload },
      };

    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload, isLoading: false },
      };

    case 'SET_CURRENT_QUESTION_INDEX':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentQuestionIndex: Math.max(0, Math.min(action.payload, state.selectedQuestions.length - 1)),
        },
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentQuestionIndex: Math.min(state.ui.currentQuestionIndex + 1, state.selectedQuestions.length - 1),
        },
      };

    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentQuestionIndex: Math.max(state.ui.currentQuestionIndex - 1, 0),
        },
      };

    default:
      return state;
  }
}

/**
 * Custom hook for examination state management
 */
export function useExaminationReducer() {
  const [state, dispatch] = useReducer(examinationReducer, initialExaminationState);

  // Memoized action creators
  const actions = {
    setStage: useCallback((stage: ExaminationState['stage']) => {
      dispatch({ type: 'SET_STAGE', payload: stage });
    }, []),

    resetExam: useCallback(() => {
      dispatch({ type: 'RESET_EXAM' });
    }, []),

    setQuestions: useCallback((questions: Question[]) => {
      dispatch({ type: 'SET_QUESTIONS', payload: questions });
    }, []),

    clearQuestions: useCallback(() => {
      dispatch({ type: 'CLEAR_QUESTIONS' });
    }, []),

    submitAnswer: useCallback((questionId: string, answer: string) => {
      dispatch({ type: 'SUBMIT_ANSWER', payload: { questionId, answer } });
    }, []),

    clearAnswers: useCallback(() => {
      dispatch({ type: 'CLEAR_ANSWERS' });
    }, []),

    toggleFlagQuestion: useCallback((questionId: string) => {
      dispatch({ type: 'TOGGLE_FLAG_QUESTION', payload: questionId });
    }, []),

    updateConfig: useCallback((config: Partial<ExamConfig>) => {
      dispatch({ type: 'UPDATE_CONFIG', payload: config });
    }, []),

    setConfig: useCallback((config: ExamConfig) => {
      dispatch({ type: 'SET_CONFIG', payload: config });
    }, []),

    setMode: useCallback((isCustom: boolean, selectedPresetId?: string) => {
      dispatch({ type: 'SET_MODE', payload: { isCustom, selectedPresetId } });
    }, []),

    setResults: useCallback((results: ExaminationResult) => {
      dispatch({ type: 'SET_RESULTS', payload: results });
    }, []),

    clearResults: useCallback(() => {
      dispatch({ type: 'CLEAR_RESULTS' });
    }, []),

    startExamination: useCallback((id: number, startedAt: string, durationSeconds: number) => {
      dispatch({ type: 'START_EXAMINATION', payload: { id, startedAt, durationSeconds } });
    }, []),

    updateTimeRemaining: useCallback((seconds: number) => {
      dispatch({ type: 'UPDATE_TIME_REMAINING', payload: seconds });
    }, []),

    completeExamination: useCallback(() => {
      dispatch({ type: 'COMPLETE_EXAMINATION' });
    }, []),

    setLoading: useCallback((isLoading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: isLoading });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),

    setCurrentQuestionIndex: useCallback((index: number) => {
      dispatch({ type: 'SET_CURRENT_QUESTION_INDEX', payload: index });
    }, []),

    nextQuestion: useCallback(() => {
      dispatch({ type: 'NEXT_QUESTION' });
    }, []),

    previousQuestion: useCallback(() => {
      dispatch({ type: 'PREVIOUS_QUESTION' });
    }, []),
  };

  return { state, dispatch, actions };
}
