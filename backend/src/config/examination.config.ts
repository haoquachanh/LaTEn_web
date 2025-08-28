import { registerAs } from '@nestjs/config';

export default registerAs('examination', () => ({
  // Duration settings
  defaultDurationSeconds: parseInt(process.env.EXAM_DEFAULT_DURATION_SECONDS, 10) || 3600,
  minDurationSeconds: parseInt(process.env.EXAM_MIN_DURATION_SECONDS, 10) || 60,
  maxDurationSeconds: parseInt(process.env.EXAM_MAX_DURATION_SECONDS, 10) || 18000,

  // Question settings
  minQuestions: parseInt(process.env.EXAM_MIN_QUESTIONS, 10) || 1,
  maxQuestions: parseInt(process.env.EXAM_MAX_QUESTIONS, 10) || 100,
  defaultQuestionsCount: parseInt(process.env.EXAM_DEFAULT_QUESTIONS, 10) || 10,

  // Scoring settings
  passingScorePercentage: parseInt(process.env.EXAM_PASSING_SCORE, 10) || 70,
  minScore: parseInt(process.env.EXAM_MIN_SCORE, 10) || 0,
  maxScore: parseInt(process.env.EXAM_MAX_SCORE, 10) || 100,

  // Feature flags
  allowReviewAfterSubmit: process.env.EXAM_ALLOW_REVIEW === 'true',
  shuffleQuestions: process.env.EXAM_SHUFFLE_QUESTIONS === 'true',
  shuffleAnswers: process.env.EXAM_SHUFFLE_ANSWERS === 'true',
  allowPause: process.env.EXAM_ALLOW_PAUSE === 'true',
  enableAntiCheat: process.env.EXAM_ENABLE_ANTI_CHEAT === 'true',

  // Pagination
  defaultPage: parseInt(process.env.EXAM_DEFAULT_PAGE, 10) || 1,
  defaultLimit: parseInt(process.env.EXAM_DEFAULT_LIMIT, 10) || 10,
  maxLimit: parseInt(process.env.EXAM_MAX_LIMIT, 10) || 100,

  // Auto-save settings
  autoSaveIntervalSeconds: parseInt(process.env.EXAM_AUTO_SAVE_INTERVAL, 10) || 30,
  warningTimeSeconds: parseInt(process.env.EXAM_WARNING_TIME, 10) || 300,

  // Retry settings
  maxRetries: parseInt(process.env.EXAM_MAX_RETRIES, 10) || 3,
  retryDelayMs: parseInt(process.env.EXAM_RETRY_DELAY_MS, 10) || 1000,
}));

export interface ExaminationConfig {
  defaultDurationSeconds: number;
  minDurationSeconds: number;
  maxDurationSeconds: number;
  minQuestions: number;
  maxQuestions: number;
  defaultQuestionsCount: number;
  passingScorePercentage: number;
  minScore: number;
  maxScore: number;
  allowReviewAfterSubmit: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  allowPause: boolean;
  enableAntiCheat: boolean;
  defaultPage: number;
  defaultLimit: number;
  maxLimit: number;
  autoSaveIntervalSeconds: number;
  warningTimeSeconds: number;
  maxRetries: number;
  retryDelayMs: number;
}
