/**
 * Examination Service
 *
 * Enterprise-grade service for handling examinations
 * including fetching, starting, and submitting exams.
 */
import api from './api';
import {
  ApiExaminationSubmission,
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
   * @param examParams Thông số của bài thi (số câu hỏi, loại câu hỏi, v.v.)
   * @returns Promise with examination details including questions
   */
  async startExamination(
    id: number | string, 
    examParams?: {
      questionsCount?: number;
      type?: string;
      content?: string;
      duration?: number;
      level?: string;
    }
  ): Promise<Examination> {
    try {
      console.log(`Starting examination with ID: ${id}`, examParams ? `with params: ${JSON.stringify(examParams)}` : '');
      
      // Gửi yêu cầu tới API endpoint /examinations/:id/start kèm theo thông số bài thi
      const response = await api.post(`${this.basePath}/${id}/start`, examParams || {});
      console.log('Start examination response:', response.data);

      // Transform backend response to match frontend Examination interface
      const examination = response.data;

      // Kiểm tra xem đã có câu hỏi chưa, nếu chưa thì tải câu hỏi từ endpoint questions
      if (!examination.questions || examination.questions.length === 0) {
        try {
          console.log(`Loading questions for examination ${id}`);
          const questionsResponse = await api.get(`${this.basePath}/${id}/questions`);
          console.log('Questions response:', questionsResponse.data);
          examination.questions = questionsResponse.data;
        } catch (error) {
          console.error(`Error loading questions for examination ${id}:`, error);
        }
      }

      // Map questions từ định dạng backend sang định dạng frontend
      if (examination.questions && examination.questions.length > 0) {
        console.log('Raw questions from API:', JSON.stringify(examination.questions));
        examination.questions = examination.questions.map((q: any) => {
          const questionObject = {
            id: q.id ? q.id.toString() : (q.questionId ? q.questionId.toString() : ''),
            question: q.text || q.content || q.question || '',
            options: Array.isArray(q.options) ? q.options : [],
            correctOption: '', // Ẩn đáp án đúng khi bắt đầu bài thi
            type: examination.type || this.mapExamType(q.type || 'multiple'),
            content: q.format?.toLowerCase() || examination.content || 'reading',
            explanation: q.explanation || '',
            questionId: q.id || q.questionId || 0, // Lưu ID gốc của câu hỏi để submit
          };
          console.log('Mapped question:', questionObject);
          return questionObject;
        });
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
      console.log(`Submitting examination ${id} answers:`, submission);
      
      // Format answers for API
      const formattedAnswers = Object.keys(submission.answers).map((questionId) => {
        const answer = submission.answers[questionId];
        console.log(`Answer for question ${questionId}:`, answer);
        return {
          questionId: parseInt(questionId),
          selectedOptionId: parseInt(answer),
          answerText: answer,
        };
      });

      // Build API submission format
      const apiSubmission: ApiExaminationSubmission = {
        answers: formattedAnswers,
        timeSpent: submission.timeSpent || 0,
      };
      
      console.log('API submission payload:', apiSubmission);

      const response = await api.post(`${this.basePath}/${id}/submit`, apiSubmission);
      console.log('Submission response:', response.data);

      // Transform response to match frontend ExaminationResult format if needed
      const result: ExaminationResult = {
        id: response.data.id,
        score: response.data.score || (response.data.correctAnswers / response.data.totalQuestions) * 100,
        totalQuestions: response.data.totalQuestions,
        correctAnswers: response.data.correctAnswers,
        incorrectAnswers: response.data.totalQuestions - response.data.correctAnswers,
        skippedAnswers: response.data.skippedAnswers || 0,
        timeSpent: response.data.timeSpent || submission.timeSpent || 0,
        completedAt: response.data.completedAt || new Date().toISOString(),
        updatedAt: response.data.updatedAt || new Date().toISOString(),
      };

      return result;
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
