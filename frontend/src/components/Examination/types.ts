/**
 * Examination Type Definitions
 *
 * Định nghĩa các kiểu dữ liệu sử dụng trong module Examination
 */

/**
 * Định nghĩa cấu trúc cho một câu hỏi trong bài thi
 */
export interface Question {
  id: string;
  question: string;
  content?: string;
  text?: string;
  // Hỗ trợ cả hai định dạng câu trả lời
  options?: Array<{
    id: string;
    text: string;
    isCorrect?: boolean;
  }>;
  answers?: string[]; // Định dạng cũ
  correctOption?: string;
  correctAnswer?: string | Array<string>;
  type: string;
  explanation?: string;
  questionId?: number;
  examinationQuestionId?: number;
}

/**
 * Định nghĩa cấu trúc cho bài thi mẫu (preset)
 */
export interface PresetExam {
  id: string | number;
  title: string;
  description: string;
  totalQuestions: number;
  durationSeconds: number;
  isActive: boolean;
  type?: string;
  content?: string;
  questions?: number;
  questionsCount?: number;
  time?: number;
  level?: string;
  config?: {
    randomize?: boolean;
    showCorrectAnswers?: boolean;
    passingScore?: number;
    categoriesDistribution?: Array<{
      categoryId: number;
      count: number;
    }>;
  };
  createdAt: string;
  updatedAt?: string;
}

/**
 * Định nghĩa cấu trúc cho kết quả bài thi
 */
export interface ExamResult {
  id: string | number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  timeSpent: number;
  percentage?: number;
  isPassed?: boolean;
  completedAt: string;
  updatedAt: string;
}

/**
 * Định nghĩa cấu trúc cho câu trả lời của người dùng
 */
export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  timeTaken?: number;
}

/**
 * Định nghĩa cấu hình bài thi
 */
export interface ExamConfig {
  type: string;
  content: string;
  timeInMinutes: number;
  questionsCount: number;
  level: string;
}
