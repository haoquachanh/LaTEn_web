/**
 * Data Transformation Utilities
 *
 * This module provides utilities for transforming data between API and UI formats.
 * It ensures consistent data structures and handles mapping between backend DTOs and frontend models.
 */

import {
  Examination,
  Question,
  ExaminationResult,
  ExaminationType,
  ExaminationLevel,
} from '@/services/types/examination.types';

/**
 * Interface for raw examination data from API
 */
export interface ExaminationDto {
  id: string | number;
  title: string;
  description?: string;
  type: string;
  level: string;
  duration: number;
  questions?: QuestionDto[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

/**
 * Interface for raw question data from API
 */
export interface QuestionDto {
  id: string | number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  categoryId?: number;
  difficulty?: string;
  explanation?: string;
}

/**
 * Transform examination DTO to frontend model
 */
export function transformExamination(dto: ExaminationDto): Examination {
  const questions = dto.questions?.map(transformQuestion) || [];

  return {
    id: Number(dto.id),
    title: dto.title,
    description: dto.description || '',
    type: dto.type as ExaminationType,
    level: dto.level as ExaminationLevel,
    duration: dto.duration,
    totalQuestions: questions.length,
    passingScore: 60, // Default passing score if not provided by API
    questions: questions,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    isActive: dto.isActive,
  };
}

/**
 * Transform question DTO to frontend model
 */
export function transformQuestion(dto: QuestionDto): Question {
  return {
    id: Number(dto.id),
    text: dto.text,
    options: dto.options,
    correctOption: dto.correctAnswerIndex,
    explanation: dto.explanation,
    difficulty: dto.difficulty,
    points: 1, // Default value if not provided by API
  };
}

/**
 * Format duration in minutes to human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Format date to locale-friendly string
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate score percentage
 */
export function calculateScorePercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Get grade letter based on score percentage
 */
export function getGradeLetter(percentage: number): string {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

/**
 * Prepare examination data for submission
 */
export function prepareExaminationSubmission(examinationId: string | number, answers: Record<string | number, number>) {
  return {
    examinationId,
    answers: Object.entries(answers).map(([questionId, answerIndex]) => ({
      questionId,
      answerIndex,
    })),
  };
}
