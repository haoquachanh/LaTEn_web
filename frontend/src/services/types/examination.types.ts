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
  type: ExaminationType;
  level: ExaminationLevel;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  isActive: boolean;
  createdBy?: {
    id: number;
    email: string;
    fullname?: string;
  };
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Question type for examination questions
 */
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  type?: string;
  format?: string;
  difficulty?: string;
  points?: number;
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
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  isPassed: boolean;
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
  answers: ExaminationAnswer[];
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
