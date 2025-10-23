import { Injectable } from '@nestjs/common';
import { QuestionType } from '@common/typings/question-type.enum';
import { Question } from '@entities/question.entity';

export interface ValidationResult {
  isCorrect: boolean | null;
  correctAnswer: any;
  feedback?: string;
}

/**
 * Service for validating question answers
 */
@Injectable()
export class QuestionValidatorService {
  /**
   * Validate an answer for a question
   * @param question The question entity
   * @param userAnswer The user's answer
   * @returns Validation result with correctness and correct answer
   */
  validateAnswer(question: Question, userAnswer: any): ValidationResult {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return this.validateMultipleChoice(question, userAnswer);

      case QuestionType.TRUE_FALSE:
        return this.validateTrueFalse(question, userAnswer);

      case QuestionType.SHORT_ANSWER:
        return this.validateShortAnswer(question, userAnswer);

      case QuestionType.ESSAY:
        return this.validateEssay(question, userAnswer);

      default:
        return this.validateDefault(question, userAnswer);
    }
  }

  /**
   * Validate multiple choice answer
   */
  private validateMultipleChoice(question: Question, userAnswer: any): ValidationResult {
    const correctOption = question.options?.find((opt) => opt.isCorrect);
    const correctAnswer = correctOption?.content;

    let isCorrect = false;

    if (typeof userAnswer === 'number') {
      // User sent option ID
      const selectedOption = question.options?.find((opt) => opt.id === userAnswer);
      isCorrect = selectedOption?.isCorrect || false;
    } else if (typeof userAnswer === 'string') {
      // User sent option content
      isCorrect = correctAnswer === userAnswer;
    } else if (Array.isArray(userAnswer)) {
      // Multiple selection (if supported)
      const correctOptionIds = question.options?.filter((opt) => opt.isCorrect).map((opt) => opt.id) || [];
      isCorrect = this.arraysEqual(userAnswer.sort(), correctOptionIds.sort());
    }

    return {
      isCorrect,
      correctAnswer: correctOption?.id || correctAnswer,
    };
  }

  /**
   * Validate true/false answer
   */
  private validateTrueFalse(question: Question, userAnswer: any): ValidationResult {
    const correctAnswer = question.correctAnswer;

    // Normalize the answer
    let normalizedAnswer = userAnswer;
    if (typeof userAnswer === 'string') {
      normalizedAnswer = userAnswer.toLowerCase() === 'true';
    }

    const isCorrect = correctAnswer === normalizedAnswer;

    return {
      isCorrect,
      correctAnswer,
    };
  }

  /**
   * Validate short answer (case-insensitive)
   */
  private validateShortAnswer(question: Question, userAnswer: any): ValidationResult {
    const correctAnswer = question.correctAnswer;

    let isCorrect = false;

    if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
      // Case-insensitive comparison with trimming
      isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    } else {
      isCorrect = userAnswer === correctAnswer;
    }

    return {
      isCorrect,
      correctAnswer,
    };
  }

  /**
   * Validate essay answer (requires manual grading)
   */
  private validateEssay(question: Question, userAnswer: any): ValidationResult {
    return {
      isCorrect: null, // Requires manual grading
      correctAnswer: question.correctAnswer,
      feedback: 'This answer requires manual grading',
    };
  }

  /**
   * Default validation
   */
  private validateDefault(question: Question, userAnswer: any): ValidationResult {
    const correctAnswer = question.correctAnswer;
    const isCorrect = correctAnswer === userAnswer;

    return {
      isCorrect,
      correctAnswer,
    };
  }

  /**
   * Normalize answer format for storage
   * @param answer The user's answer
   * @returns Normalized answer as string
   */
  normalizeAnswer(answer: any): string {
    if (typeof answer === 'object') {
      return JSON.stringify(answer);
    }
    return String(answer);
  }

  /**
   * Parse stored answer back to original format
   * @param storedAnswer The stored answer string
   * @returns Parsed answer
   */
  parseAnswer(storedAnswer: string): any {
    if (!storedAnswer) return null;

    try {
      return JSON.parse(storedAnswer);
    } catch {
      return storedAnswer;
    }
  }

  /**
   * Helper to compare arrays
   */
  private arraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    return true;
  }

  /**
   * Validate answer format based on question type
   * @param questionType The type of question
   * @param answer The answer to validate
   * @returns Whether the answer format is valid
   */
  isValidAnswerFormat(questionType: QuestionType, answer: any): boolean {
    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return typeof answer === 'number' || typeof answer === 'string' || Array.isArray(answer);

      case QuestionType.TRUE_FALSE:
        return typeof answer === 'boolean' || answer === 'true' || answer === 'false';

      case QuestionType.SHORT_ANSWER:
        return typeof answer === 'string' && answer.trim().length > 0;

      case QuestionType.ESSAY:
        return typeof answer === 'string' && answer.trim().length > 0;

      default:
        return answer !== null && answer !== undefined;
    }
  }

  /**
   * Get expected answer format description for a question type
   * @param questionType The type of question
   * @returns Description of expected format
   */
  getExpectedFormat(questionType: QuestionType): string {
    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        return 'Option ID (number) or option content (string)';

      case QuestionType.TRUE_FALSE:
        return 'Boolean value (true/false)';

      case QuestionType.SHORT_ANSWER:
        return 'Text string';

      case QuestionType.ESSAY:
        return 'Text string (minimum length may apply)';

      default:
        return 'Any value';
    }
  }
}
