import { Injectable } from '@nestjs/common';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { Examination } from '@entities/examination.entity';

/**
 * Service for calculating scores and validating answers
 */
@Injectable()
export class ScoreCalculatorService {
  /**
   * Calculate the total score for an examination
   * @param examination The examination with questions
   * @returns Object with score breakdown
   */
  calculateExaminationScore(examination: Examination): {
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    totalScore: number;
    percentage: number;
    isPassed: boolean;
  } {
    if (!examination.examinationQuestions || examination.examinationQuestions.length === 0) {
      return {
        correctAnswers: 0,
        incorrectAnswers: 0,
        skippedQuestions: 0,
        totalScore: 0,
        percentage: 0,
        isPassed: false,
      };
    }

    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let skippedQuestions = 0;
    let totalScore = 0;

    for (const question of examination.examinationQuestions) {
      if (question.isCorrect === true) {
        correctAnswers++;
        totalScore += question.score;
      } else if (question.isCorrect === false) {
        incorrectAnswers++;
      } else if (question.userAnswer === null || question.userAnswer === undefined) {
        skippedQuestions++;
      } else {
        // Essay questions or pending grading
        incorrectAnswers++;
      }
    }

    const totalQuestions = examination.examinationQuestions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Calculate score on a 10-point scale
    const scoreOutOfTen = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 10 : 0;

    return {
      correctAnswers,
      incorrectAnswers,
      skippedQuestions,
      totalScore: Math.round(scoreOutOfTen * 100) / 100, // Round to 2 decimal places
      percentage,
      isPassed: percentage >= 70,
    };
  }

  /**
   * Calculate score for a single question
   * @param question The examination question
   * @param isCorrect Whether the answer is correct
   * @returns The score for the question
   */
  calculateQuestionScore(question: ExaminationQuestion, isCorrect: boolean | null): number {
    if (isCorrect === true) {
      return question.question.getPoints();
    }

    // No partial credit for now
    return 0;
  }

  /**
   * Calculate percentage score
   * @param correctAnswers Number of correct answers
   * @param totalQuestions Total number of questions
   * @returns Percentage (0-100)
   */
  calculatePercentage(correctAnswers: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }

  /**
   * Calculate score on a 10-point scale
   * @param correctAnswers Number of correct answers
   * @param totalQuestions Total number of questions
   * @returns Score out of 10
   */
  calculateScoreOutOfTen(correctAnswers: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 10 * 100) / 100; // Round to 2 decimals
  }

  /**
   * Determine if the examination is passed
   * @param percentage The percentage score
   * @param passingThreshold The passing threshold (default: 70%)
   * @returns Whether the exam is passed
   */
  isPassed(percentage: number, passingThreshold: number = 70): boolean {
    return percentage >= passingThreshold;
  }

  /**
   * Calculate time spent on examination in seconds
   * @param startedAt Start time
   * @param completedAt Completion time (optional, uses current time if not provided)
   * @returns Time spent in seconds
   */
  calculateTimeSpent(startedAt: Date, completedAt?: Date): number {
    const endTime = completedAt || new Date();
    return Math.round((endTime.getTime() - startedAt.getTime()) / 1000);
  }

  /**
   * Check if examination has expired
   * @param startedAt Start time
   * @param durationSeconds Duration in seconds
   * @returns Whether the exam has expired
   */
  isExaminationExpired(startedAt: Date, durationSeconds: number): boolean {
    const currentTime = new Date();
    const endTime = new Date(startedAt);
    endTime.setSeconds(endTime.getSeconds() + durationSeconds);

    return currentTime > endTime;
  }

  /**
   * Calculate remaining time in seconds
   * @param startedAt Start time
   * @param durationSeconds Duration in seconds
   * @returns Remaining time in seconds (0 if expired)
   */
  calculateRemainingTime(startedAt: Date, durationSeconds: number): number {
    const currentTime = new Date();
    const endTime = new Date(startedAt);
    endTime.setSeconds(endTime.getSeconds() + durationSeconds);

    const remaining = Math.floor((endTime.getTime() - currentTime.getTime()) / 1000);
    return remaining > 0 ? remaining : 0;
  }
}
