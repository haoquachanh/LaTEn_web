/**
 * Examination API Types
 * Type definitions for API requests and responses
 */

/**
 * Question option from API
 */
export interface QuestionOptionApiResponse {
  id: number;
  text: string;
  isCorrect: boolean;
  order?: number;
}

/**
 * Question from API
 */
export interface QuestionApiResponse {
  id: number;
  content: string;
  type: string;
  mode: string;
  format?: string;
  difficulty?: string;
  difficultyLevel?: string;
  points?: number;
  options: QuestionOptionApiResponse[];
  correctAnswer?: string;
  correctOption?: number | string;
  explanation?: string;
  audioUrl?: string | null;
  imageUrl?: string | null;
  categoryId?: number;
  bankId?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Examination Question (junction table) from API
 */
export interface ExaminationQuestionApiResponse {
  id: number;
  examinationId: number;
  questionId: number;
  order?: number;
  userAnswer?: string | number | boolean | Array<string | number>;
  isCorrect?: boolean;
  timeSpent?: number;
  question?: QuestionApiResponse;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Examination from API
 */
export interface ExaminationApiResponse {
  id: number;
  title: string;
  description?: string;
  durationSeconds: number;
  totalQuestions: number;
  type: string;
  content: string;
  level: string;
  userId?: number;
  templateId?: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  correctAnswers?: number;
  questions?: QuestionApiResponse[];
  examinationQuestions?: ExaminationQuestionApiResponse[];
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

/**
 * Template configuration from API
 */
export interface TemplateConfigApiResponse {
  randomize?: boolean;
  showCorrectAnswers?: boolean;
  passingScore?: number;
  categoriesDistribution?: Array<{
    categoryId: number;
    count: number;
  }>;
}

/**
 * Examination Template from API
 */
export interface TemplateApiResponse {
  id: number;
  title: string;
  description?: string;
  totalQuestions: number;
  durationSeconds: number;
  isActive: boolean;
  config?: TemplateConfigApiResponse;
  createdAt: string;
  updatedAt: string;
  createdById?: number;
}

/**
 * Examination Result from API
 */
export interface ExaminationResultApiResponse {
  id: number;
  examinationId: number;
  userId: number;
  score: number; // Thang điểm 0-10
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers?: number;
  skippedAnswers?: number;
  timeSpent: number; // seconds
  isPassed: boolean;
  completedAt: string;
  updatedAt: string;
  examination?: ExaminationApiResponse;
  detailedResults?: Array<{
    questionId: number;
    examinationQuestionId?: number;
    isCorrect: boolean;
    selectedOption: number | string | null;
    correctOption: number | string | null;
    question?: QuestionApiResponse;
  }>;
}

/**
 * Paginated API response wrapper
 */
export interface PaginatedApiResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * API Request types
 */

export interface StartExaminationRequest {
  templateId: number;
}

export interface SubmitAnswerRequest {
  questionId: number;
  answer: string | number | boolean | Array<string | number>;
}

export interface CreateExaminationRequest {
  title: string;
  description?: string;
  templateId?: number;
  durationSeconds: number;
  totalQuestions: number;
  type?: string;
  content?: string;
  level?: string;
}

export interface UpdateExaminationRequest {
  title?: string;
  description?: string;
  durationSeconds?: number;
}

/**
 * Dashboard data from API
 */
export interface DashboardApiResponse {
  userStats: {
    totalExams: number;
    completedExams: number;
    averageScore: number;
    bestScore: number;
    totalTimeSpent: number;
  };
  recentAttempts: PaginatedApiResponse<ExaminationResultApiResponse>;
  availableTemplates: PaginatedApiResponse<TemplateApiResponse>;
  currentExamination?: ExaminationApiResponse;
}
