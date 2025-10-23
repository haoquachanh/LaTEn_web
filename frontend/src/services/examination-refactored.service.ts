/**
 * Examination Service - Refactored
 *
 * Uses the unified API client for consistent error handling and response parsing
 */
import apiClient from './unifiedApiClient';
import { API_ROUTES } from '@/config/apiRoutes';
import { PresetExam } from '@/components/Examination/types';

/**
 * Examination Types
 */
export interface Examination {
  id: number;
  title: string;
  description: string;
  duration: number;
  durationSeconds: number;
  totalQuestions: number;
  type: string;
  level: string;
  content: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  questions: ExaminationQuestion[];
}

export interface ExaminationQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
  correctOption?: string;
  type: string;
  content: string;
  explanation?: string;
  questionId?: number;
  examinationQuestionId?: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface ExaminationResult {
  id: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  timeSpent: number;
  completedAt: string;
  updatedAt: string;
}

export interface ExaminationSubmission {
  answers: Record<string, any>;
  timeSpent: number;
}

/**
 * Examination Service Class
 */
class ExaminationServiceRefactored {
  /**
   * Get preset examinations
   */
  async getPresetExaminations(): Promise<PresetExam[]> {
    const templates = await apiClient.get<any[]>(API_ROUTES.EXAMINATION.PRESETS);

    return templates.map((template: any) => ({
      id: template.id.toString(),
      title: template.title,
      description: template.description || '',
      totalQuestions: template.totalQuestions,
      durationSeconds: template.durationSeconds,
      isActive: template.isActive,
      type: 'multiple',
      questions: template.totalQuestions,
      questionsCount: template.totalQuestions,
      time: Math.ceil(template.durationSeconds / 60),
      content: 'reading',
      config: template.config,
      createdAt: template.createdAt,
    }));
  }

  /**
   * Start an examination
   */
  async startExamination(templateId: number | string): Promise<Examination> {
    const response = await apiClient.post<any>('/examinations/start', {
      presetId: Number(templateId),
    });

    const examination: Examination = {
      id: response.id,
      title: response.title,
      description: response.description,
      duration: response.durationSeconds / 60,
      durationSeconds: response.durationSeconds,
      totalQuestions: response.totalQuestions,
      type: 'multiple',
      level: 'medium',
      content: 'reading',
      score: response.score,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      startedAt: response.startedAt,
      completedAt: response.completedAt,
      questions: [],
    };

    // Map questions
    if (response.examinationQuestions && response.examinationQuestions.length > 0) {
      examination.questions = response.examinationQuestions.map((eq: any) => {
        const q = eq.question;

        let options = [];
        if (q.type === 'true_false') {
          options = [
            { id: 'true', text: 'True' },
            { id: 'false', text: 'False' },
          ];
        } else if (q.type === 'multiple_choice' && Array.isArray(q.options)) {
          options = q.options.map((opt: any) => ({
            id: opt.id.toString(),
            text: opt.content || opt.text || '',
            isCorrect: opt.isCorrect,
          }));
        }

        return {
          id: eq.id.toString(),
          question: q.content || '',
          options: options,
          correctOption: '',
          type: q.type || 'multiple_choice',
          content: q.content || '',
          explanation: q.explanation || '',
          questionId: q.id,
          examinationQuestionId: eq.id,
        };
      });
    }

    return examination;
  }

  /**
   * Submit an answer
   */
  async submitAnswer(examinationId: number | string, questionId: number | string, answer: any): Promise<any> {
    return await apiClient.post(`/examinations/${examinationId}/submit-answer`, {
      questionId: Number(questionId),
      answer: answer,
    });
  }

  /**
   * Complete examination
   */
  async completeExamination(examinationId: number | string, timeSpent?: number): Promise<ExaminationResult> {
    const response = await apiClient.patch<any>(`/examinations/${examinationId}/complete`, {
      timeSpent: timeSpent || 0,
    });

    const skippedAnswers = response.skippedAnswers !== undefined ? response.skippedAnswers : 0;
    const answeredQuestions = response.totalQuestions - skippedAnswers;
    const incorrectAnswers = answeredQuestions - response.correctAnswers;

    return {
      id: response.id,
      score: response.score * 10,
      totalQuestions: response.totalQuestions,
      correctAnswers: response.correctAnswers,
      incorrectAnswers: incorrectAnswers,
      skippedAnswers: skippedAnswers,
      timeSpent: response.timeSpent || timeSpent || 0,
      completedAt: response.completedAt || new Date().toISOString(),
      updatedAt: response.updatedAt || new Date().toISOString(),
    };
  }

  /**
   * Get user's examination results
   */
  async getUserResults(): Promise<ExaminationResult[]> {
    return await apiClient.get<ExaminationResult[]>(API_ROUTES.EXAMINATION.RESULTS);
  }

  /**
   * Get examination by ID
   */
  async getExaminationById(id: number | string): Promise<Examination> {
    return await apiClient.get<Examination>(API_ROUTES.EXAMINATION.BY_ID(id));
  }

  /**
   * Get result by ID
   */
  async getResultById(id: number | string): Promise<ExaminationResult> {
    return await apiClient.get<ExaminationResult>(API_ROUTES.EXAMINATION.RESULT_BY_ID(id));
  }
}

const examinationServiceRefactored = new ExaminationServiceRefactored();
export default examinationServiceRefactored;
