/**
 * Examination Service
 *
 * Enterprise-grade service for handling examinations
 * including fetching, starting, and submitting exams.
 */
import api from './api';
import {
  Examination,
  ExaminationAnswer,
  ExaminationLevel,
  ExaminationQueryParams,
  ExaminationResult,
  ExaminationSubmission,
  ExaminationType,
  ResultQueryParams,
} from './types/examination.types';
// Import PresetExam để sử dụng cho kiểu dữ liệu trả về
import { PresetExam } from '@/components/Examination/types';

/**
 * ExaminationService provides methods to interact with examination endpoints
 */
class ExaminationService {
  private basePath = '/examinations';

  /**
   * Get preset examinations
   *
   * @returns Promise with array of preset exams for the frontend
   */
  async getPresetExaminations(): Promise<PresetExam[]> {
    try {
      const response = await api.get(`${this.basePath}/presets`);

      // Transform backend preset format to match frontend PresetExam format
      const presets: PresetExam[] = response.data.map((preset: any) => ({
        id: preset.id,
        title: preset.title,
        description: preset.description || '',
        type: this.mapExamType(preset.type),
        questions: preset.totalQuestions,
        questionsCount: preset.totalQuestions,
        time: preset.duration,
        content: preset.type.toLowerCase(), // Using type as content (reading/listening)
      }));

      return presets;
    } catch (error) {
      console.error('Error fetching preset examinations:', error);
      throw error;
    }
  }

  /**
   * Map backend examination type to frontend type
   */
  private mapExamType(type: string): string {
    switch (type) {
      case 'grammar':
      case 'vocabulary':
        return 'multiple';
      case 'listening':
        return 'multiple';
      case 'reading':
        return 'multiple';
      case 'mixed':
        return 'multiple';
      default:
        return 'multiple';
    }
  }

  /**
   * Get all examinations with optional filtering
   *
   * @param params Optional query parameters
   * @returns Promise with array of examinations
   */
  async getAllExaminations(params?: ExaminationQueryParams): Promise<{
    data: Examination[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await api.get(this.basePath, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching examinations:', error);
      throw error;
    }
  }

  /**
   * Get examination by ID
   *
   * @param id Examination ID
   * @returns Promise with examination details
   */
  async getExaminationById(id: number | string): Promise<Examination> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching examination ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get examinations filtered by type
   *
   * @param type Examination type
   * @param params Additional query parameters
   * @returns Promise with filtered examinations
   */
  async getExaminationsByType(
    type: ExaminationType,
    params?: Omit<ExaminationQueryParams, 'type'>,
  ): Promise<Examination[]> {
    try {
      const response = await api.get(`${this.basePath}/type/${type}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching examinations by type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Get examinations filtered by level
   *
   * @param level Examination level
   * @param params Additional query parameters
   * @returns Promise with filtered examinations
   */
  async getExaminationsByLevel(
    level: ExaminationLevel,
    params?: Omit<ExaminationQueryParams, 'level'>,
  ): Promise<Examination[]> {
    try {
      const response = await api.get(`${this.basePath}/level/${level}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching examinations by level ${level}:`, error);
      throw error;
    }
  }

  /**
   * Create a new examination (admin/teacher only)
   *
   * @param examinationData Examination data
   * @returns Promise with created examination
   */
  async createExamination(examinationData: Partial<Examination>): Promise<Examination> {
    try {
      const response = await api.post(this.basePath, examinationData);
      return response.data;
    } catch (error) {
      console.error('Error creating examination:', error);
      throw error;
    }
  }

  /**
   * Update an existing examination (admin/teacher only)
   *
   * @param id Examination ID
   * @param updateData Data to update
   * @returns Promise with updated examination
   */
  async updateExamination(id: number | string, updateData: Partial<Examination>): Promise<Examination> {
    try {
      const response = await api.put(`${this.basePath}/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating examination ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an examination (admin/teacher only)
   *
   * @param id Examination ID
   * @returns Promise with success message
   */
  async deleteExamination(id: number | string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting examination ${id}:`, error);
      throw error;
    }
  }

  /**
   * Start an examination session
   *
   * @param id Examination ID
   * @returns Promise with examination details including questions
   */
  async startExamination(id: number | string): Promise<Examination> {
    try {
      const response = await api.post(`${this.basePath}/${id}/start`);

      // Transform backend response to match frontend Examination interface
      const examination = response.data;

      // Map questions from backend format to frontend format
      if (examination.questions) {
        examination.questions = examination.questions.map((q: any) => ({
          id: q.id,
          text: q.content,
          options: q.options || [],
          correctOption: q.correctAnswer, // This will be used for validation after submission
          explanation: q.explanation,
          type: q.type,
          format: q.format,
          difficulty: q.difficulty,
          points: q.points || 1,
        }));
      }

      return examination;
    } catch (error) {
      console.error(`Error starting examination ${id}:`, error);
      throw error;
    }
  } /**
   * Submit examination answers
   *
   * @param id Examination ID
   * @param submission Answers and time spent
   * @returns Promise with examination result
   */
  async submitExamination(id: number | string, submission: ExaminationSubmission): Promise<ExaminationResult> {
    try {
      const response = await api.post(`${this.basePath}/${id}/submit`, submission);
      return response.data;
    } catch (error) {
      console.error(`Error submitting examination ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get user's examination results
   *
   * @param params Optional query parameters
   * @returns Promise with array of user's results
   */
  async getUserResults(params?: ResultQueryParams): Promise<ExaminationResult[]> {
    try {
      const response = await api.get(`${this.basePath}/results/my`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user results:', error);
      throw error;
    }
  }

  /**
   * Get all results for a specific examination
   *
   * @param id Examination ID
   * @param params Optional query parameters
   * @returns Promise with array of examination results
   */
  async getExaminationResults(
    id: number | string,
    params?: Omit<ResultQueryParams, 'examinationId'>,
  ): Promise<ExaminationResult[]> {
    try {
      const response = await api.get(`${this.basePath}/${id}/results`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching results for examination ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific result by ID
   *
   * @param id Result ID
   * @returns Promise with examination result
   */
  async getResultById(id: number | string): Promise<ExaminationResult> {
    try {
      const response = await api.get(`${this.basePath}/results/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching result ${id}:`, error);
      throw error;
    }
  }
}

const examinationService = new ExaminationService();
export default examinationService;
