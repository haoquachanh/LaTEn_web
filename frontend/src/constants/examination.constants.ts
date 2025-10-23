/**
 * Examination Constants
 * Centralized constants for examination features
 */

/**
 * Timer and interval constants
 */
export const TIMER_INTERVAL_MS = 1000;
export const AUTO_SAVE_INTERVAL_MS = 30000; // 30 seconds
export const TIME_WARNING_THRESHOLD_SECONDS = 60; // 1 minute
export const TIME_CRITICAL_THRESHOLD_SECONDS = 300; // 5 minutes

/**
 * Exam configuration limits
 */
export const EXAM_CONFIG_LIMITS = {
  MIN_TIME_MINUTES: 5,
  MAX_TIME_MINUTES: 180,
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 100,
  DEFAULT_TIME_MINUTES: 30,
  DEFAULT_QUESTIONS: 10,
} as const;

/**
 * Score thresholds
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  PASSING: 70,
} as const;

/**
 * Exam types
 */
export const EXAM_TYPES = {
  MULTIPLE_CHOICE: 'multiple',
  TRUE_FALSE: 'true-false',
  ESSAY: 'essay',
  MIXED: 'mixed',
} as const;

/**
 * Content types
 */
export const CONTENT_TYPES = {
  READING: 'reading',
  LISTENING: 'listening',
  GRAMMAR: 'grammar',
  VOCABULARY: 'vocabulary',
  MIXED: 'mixed',
} as const;

/**
 * Difficulty levels
 */
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

/**
 * Exam stages
 */
export const EXAM_STAGES = {
  DASHBOARD: 'dashboard',
  SETUP: 'setup',
  IN_PROGRESS: 'inProgress',
  RESULTS: 'results',
} as const;

/**
 * Question modes
 */
export const QUESTION_MODES = {
  READING: 'reading',
  LISTENING: 'listening',
  WRITING: 'writing',
  SPEAKING: 'speaking',
} as const;

/**
 * API endpoints
 */
export const EXAMINATION_API_ENDPOINTS = {
  CREATE: '/examinations',
  SUBMIT_ANSWER: '/examinations/:id/answers',
  COMPLETE: '/examinations/:id/complete',
  GET_BY_ID: '/examinations/:id',
  GET_USER_EXAMS: '/examinations/user/:userId',
  GET_STATS: '/examinations/user/:userId/stats',
  CANCEL: '/examinations/:id/cancel',
  DASHBOARD: '/examinations/dashboard',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  EXAM_STATE: 'examination_state',
  EXAM_ANSWERS: 'examination_answers',
  EXAM_CONFIG: 'examination_config',
  FLAGGED_QUESTIONS: 'examination_flagged_questions',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  EXAM_NOT_FOUND: 'Examination not found',
  QUESTION_NOT_FOUND: 'Question not found',
  INVALID_CONFIG: 'Invalid examination configuration',
  SUBMIT_FAILED: 'Failed to submit answer',
  LOAD_FAILED: 'Failed to load examination',
  TIME_EXPIRED: 'Examination time has expired',
  NETWORK_ERROR: 'Network error occurred',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  EXAM_CREATED: 'Examination created successfully',
  ANSWER_SUBMITTED: 'Answer submitted successfully',
  EXAM_COMPLETED: 'Examination completed successfully',
  EXAM_CANCELLED: 'Examination cancelled',
} as const;
