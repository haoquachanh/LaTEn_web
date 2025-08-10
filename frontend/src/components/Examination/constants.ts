/**
 * Constants for examination module
 *
 * This file contains constants and enums used across the examination components
 */

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  ESSAY = 'essay',
  SHORT_ANSWER = 'short_answer',
  FILL_IN_BLANKS = 'fill_in_blanks',
}

export enum ExamDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum ExamContent {
  READING = 'reading',
  LISTENING = 'listening',
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  MIXED = 'mixed',
}

export const DEFAULT_DURATION_SECONDS = 3600; // 1 hour default
export const DEFAULT_TIME_LIMIT_SECONDS = 7200; // 2 hours max

export const QUESTIONS_PER_PAGE = {
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3,
};

// Map question types to display names
export const QUESTION_TYPE_LABELS = {
  [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QuestionType.TRUE_FALSE]: 'True/False',
  [QuestionType.ESSAY]: 'Essay',
  [QuestionType.SHORT_ANSWER]: 'Short Answer',
  [QuestionType.FILL_IN_BLANKS]: 'Fill in the Blanks',
};
