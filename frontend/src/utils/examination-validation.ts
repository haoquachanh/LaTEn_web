/**
 * Examination Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';
import { EXAM_CONFIG_LIMITS, EXAM_TYPES, CONTENT_TYPES, DIFFICULTY_LEVELS } from '@/constants/examination.constants';

/**
 * Exam configuration validation schema
 */
export const examConfigSchema = z.object({
  type: z.enum([EXAM_TYPES.MULTIPLE_CHOICE, EXAM_TYPES.TRUE_FALSE, EXAM_TYPES.ESSAY, EXAM_TYPES.MIXED] as [
    string,
    ...string[],
  ]),
  content: z.enum([
    CONTENT_TYPES.READING,
    CONTENT_TYPES.LISTENING,
    CONTENT_TYPES.GRAMMAR,
    CONTENT_TYPES.VOCABULARY,
    CONTENT_TYPES.MIXED,
  ] as [string, ...string[]]),
  timeInMinutes: z
    .number()
    .min(EXAM_CONFIG_LIMITS.MIN_TIME_MINUTES, {
      message: `Time must be at least ${EXAM_CONFIG_LIMITS.MIN_TIME_MINUTES} minutes`,
    })
    .max(EXAM_CONFIG_LIMITS.MAX_TIME_MINUTES, {
      message: `Time cannot exceed ${EXAM_CONFIG_LIMITS.MAX_TIME_MINUTES} minutes`,
    }),
  questionsCount: z
    .number()
    .min(EXAM_CONFIG_LIMITS.MIN_QUESTIONS, {
      message: `Must have at least ${EXAM_CONFIG_LIMITS.MIN_QUESTIONS} question`,
    })
    .max(EXAM_CONFIG_LIMITS.MAX_QUESTIONS, {
      message: `Cannot exceed ${EXAM_CONFIG_LIMITS.MAX_QUESTIONS} questions`,
    }),
  level: z.enum([DIFFICULTY_LEVELS.BEGINNER, DIFFICULTY_LEVELS.INTERMEDIATE, DIFFICULTY_LEVELS.ADVANCED] as [
    string,
    ...string[],
  ]),
});

/**
 * Type inference from schema
 */
export type ExamConfigValidation = z.infer<typeof examConfigSchema>;

/**
 * Answer submission validation schema
 */
export const answerSubmissionSchema = z.object({
  questionId: z.union([z.string(), z.number()]).transform((val) => String(val)),
  answer: z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))]),
});

export type AnswerSubmissionValidation = z.infer<typeof answerSubmissionSchema>;

/**
 * Start examination request validation schema
 */
export const startExaminationSchema = z.object({
  templateId: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  title: z.string().optional(),
  description: z.string().optional(),
});

export type StartExaminationValidation = z.infer<typeof startExaminationSchema>;

/**
 * Question validation schema
 */
export const questionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  content: z.string().min(1, 'Question content cannot be empty'),
  type: z.string(),
  mode: z.string().optional(),
  options: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      text: z.string(),
      isCorrect: z.boolean().optional(),
    }),
  ),
  correctAnswer: z.union([z.string(), z.number()]).optional(),
  explanation: z.string().optional(),
});

export type QuestionValidation = z.infer<typeof questionSchema>;

/**
 * Examination result validation schema
 */
export const examinationResultSchema = z.object({
  id: z.number(),
  score: z.number().min(0).max(100),
  totalQuestions: z.number().min(1),
  correctAnswers: z.number().min(0),
  incorrectAnswers: z.number().min(0),
  skippedAnswers: z.number().min(0).optional(),
  timeSpent: z.number().min(0),
  completedAt: z.string(),
  isPassed: z.boolean().optional(),
  percentage: z.number().min(0).max(100).optional(),
});

export type ExaminationResultValidation = z.infer<typeof examinationResultSchema>;

/**
 * Validation helper functions
 */

/**
 * Validate exam configuration and return errors
 */
export function validateExamConfig(config: unknown): {
  success: boolean;
  data?: ExamConfigValidation;
  errors?: string[];
} {
  try {
    const validated = examConfigSchema.parse(config);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => err.message),
      };
    }
    return {
      success: false,
      errors: ['Invalid configuration'],
    };
  }
}

/**
 * Validate answer submission
 */
export function validateAnswerSubmission(data: unknown): {
  success: boolean;
  data?: AnswerSubmissionValidation;
  errors?: string[];
} {
  try {
    const validated = answerSubmissionSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => err.message),
      };
    }
    return {
      success: false,
      errors: ['Invalid answer submission'],
    };
  }
}

/**
 * Validate question data
 */
export function validateQuestion(question: unknown): {
  success: boolean;
  data?: QuestionValidation;
  errors?: string[];
} {
  try {
    const validated = questionSchema.parse(question);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => `${err.path.join('.')}: ${err.message}`),
      };
    }
    return {
      success: false,
      errors: ['Invalid question data'],
    };
  }
}

/**
 * Safe parse with default value
 */
export function safeParseExamConfig(config: unknown, defaultValue: ExamConfigValidation): ExamConfigValidation {
  try {
    return examConfigSchema.parse(config);
  } catch {
    return defaultValue;
  }
}
