/**
 * Examination Service Types
 *
 * TypeScript interfaces and types for the examination service
 * that match the backend entity structure.
 */

/**
 * Examination types
 */
export enum ExaminationType {
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  LISTENING = 'listening',
  READING = 'reading',
  MIXED = 'mixed',
}

/**
 * Examination difficulty levels
 */
export enum ExaminationLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

/**
 * Examination entity interface
 */
export interface Examination {
  id: number;
  title: string;
  description?: string;
  type?: string;
  level?: string;
  duration?: number;
  durationSeconds?: number;
  totalQuestions: number;
  passingScore?: number;
  isActive?: boolean;
  createdBy?: {
    id: number;
    email: string;
    fullname?: string;
  };
  questions?: Question[];
  startedAt?: string;
  completedAt?: string;
  score?: number;
  mode?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  // Additional properties for frontend use
  examinationQuestions?: any[]; // Raw questions from API
}

/**
 * Question type for examination questions
 */
export interface Question {
  id: string | number;
  question?: string;
  text?: string;
  content?: string;
  options?: any[];
  correctOption?: string | number;
  correctAnswer?: string;
  explanation?: string;
  type?: string;
  mode?: string;
  format?: string;
  difficultyLevel?: string;
  difficulty?: string;
  points?: number;
  audioUrl?: string | null;
  questionId?: number; // Original question ID
  examinationQuestionId?: number; // ExaminationQuestion ID
}

/**
 * Answer submission shape
 */
export interface ExaminationAnswer {
  questionId: number;
  selectedOption: number;
}

/**
 * Parameters for examination list queries
 */
export interface ExaminationQueryParams {
  page?: number;
  limit?: number;
  type?: ExaminationType;
  level?: ExaminationLevel;
  searchTerm?: string;
  isActive?: boolean;
}

/**
 * Examination result interface
 */
export interface ExaminationResult {
  id: number;
  score: number;
  percentage?: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers?: number;
  skippedAnswers?: number;
  timeSpent: number;
  isPassed?: boolean;
  submittedAt?: string;
  detailedResults?: {
    questionId: number;
    isCorrect: boolean;
    selectedOption: number;
    correctOption: number;
  }[];
  user?: {
    id: number;
    email: string;
    fullname?: string;
  };
  examination?: Examination;
  completedAt: string;
  updatedAt: string;
}

/**
 * Structure for examination submission
 */
export interface ExaminationSubmission {
  answers: { [key: string]: string }; // Map of questionId to selectedOptionId
  timeSpent?: number;
}

/**
 * API format for examination submission
 */
export interface ApiExaminationSubmission {
  answers: {
    questionId: number;
    selectedOptionId?: number;
    answerText?: string;
  }[];
  timeSpent?: number;
}

/**
 * Result query parameters
 */
export interface ResultQueryParams {
  page?: number;
  limit?: number;
  userId?: number;
  examinationId?: number;
  sortBy?: 'score' | 'completedAt';
  sortOrder?: 'ASC' | 'DESC';
}
