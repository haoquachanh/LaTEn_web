/**
 * Examination Constants
 *
 * Centralized constants for examination module
 * to avoid magic numbers and hardcoded values
 */

export const EXAMINATION_CONSTANTS = {
  // Duration settings (in seconds)
  DEFAULT_DURATION_SECONDS: 3600, // 1 hour
  MIN_DURATION_SECONDS: 60, // 1 minute
  MAX_DURATION_SECONDS: 18000, // 5 hours

  // Question settings
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 100,
  DEFAULT_QUESTIONS_COUNT: 10,

  // Scoring settings
  PASSING_SCORE_PERCENTAGE: 70,
  MIN_SCORE: 0,
  MAX_SCORE: 100,

  // Points per question type
  QUESTION_POINTS: {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
  },

  // Pagination settings
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Time settings
  AUTO_SAVE_INTERVAL_SECONDS: 30,
  WARNING_TIME_SECONDS: 300, // 5 minutes

  // Status values
  STATUS: {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
  },

  // Validation rules
  VALIDATION: {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
  },
} as const;

export type ExaminationStatus = (typeof EXAMINATION_CONSTANTS.STATUS)[keyof typeof EXAMINATION_CONSTANTS.STATUS];
