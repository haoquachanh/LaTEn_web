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
    },
  ): Promise<Examination> {
    try {
      console.log(
        `Starting examination with ID: ${id}`,
        examParams ? `with params: ${JSON.stringify(examParams)}` : '',
      );

      // Fetch the examination directly from the endpoint
      // Using GET instead of POST since the API already has the data ready
      const response = await api.get(`${this.basePath}/${id}`);
      console.log('Examination response:', response.data);

      // Transform backend response to match frontend Examination interface
      const examination: Examination = {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        duration: response.data.durationSeconds / 60, // Convert seconds to minutes
        totalQuestions: response.data.totalQuestions,
        type: response.data.type || 'multiple',
        level: response.data.level || 'medium',
        content: response.data.mode || 'reading',
        score: response.data.score,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        startedAt: response.data.startedAt,
        completedAt: response.data.completedAt,
        questions: [],
      };

      // Extract and map questions from examinationQuestions array
      if (response.data.examinationQuestions && response.data.examinationQuestions.length > 0) {
        console.log('Raw questions from API:', JSON.stringify(response.data.examinationQuestions));

        examination.questions = response.data.examinationQuestions.map((eq: any) => {
          const q = eq.question; // Get the actual question object

          // For true_false questions, create two options
          let options = [];
          if (q.type === 'true_false') {
            options = [
              { id: 'true', text: 'True' },
              { id: 'false', text: 'False' },
            ];
          } else if (Array.isArray(q.options)) {
            options = q.options;
          }

          const questionObject = {
            id: eq.id.toString(), // Use the examinationQuestion ID
            question: q.content || '',
            options: options,
            correctOption: '', // Hide correct answer during the exam
            type: q.type || 'multiple',
            content: q.mode || 'reading',
            explanation: q.explanation || '',
            questionId: q.id, // Store the original question ID for submission
            examinationQuestionId: eq.id, // Store the examinationQuestion ID for submission
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

      // Format answers for API - Use examinationQuestionId as the key
      const formattedAnswers = Object.keys(submission.answers).map((questionId) => {
        const answer = submission.answers[questionId];
        console.log(`Answer for question ${questionId}:`, answer);
        return {
          examinationQuestionId: parseInt(questionId),
          userAnswer: answer,
        };
      });

      // Build API submission format
      const apiSubmission = {
        answers: formattedAnswers,
        timeSpent: submission.timeSpent || 0,
      };

      console.log('API submission payload:', apiSubmission);

      // For this API, use PATCH to update each examination question with user's answer
      // This simulates a submission by updating each question individually
      const updatePromises = formattedAnswers.map((answer) =>
        api.patch(`${this.basePath}/questions/${answer.examinationQuestionId}`, {
          userAnswer: answer.userAnswer,
        }),
      );

      await Promise.all(updatePromises);

      // Then mark the examination as completed
      const completeResponse = await api.patch(`${this.basePath}/${id}`, {
        completedAt: new Date().toISOString(),
      });

      console.log('Completion response:', completeResponse.data);

      // Get updated examination data to calculate score
      const examResponse = await api.get(`${this.basePath}/${id}`);
      const updatedExam = examResponse.data;

      // Calculate score based on correct answers
      const correctAnswers = updatedExam.examinationQuestions?.filter((q: any) => q.isCorrect).length || 0;
      const score = (correctAnswers / updatedExam.totalQuestions) * 100;

      // Update the score in the examination
      await api.patch(`${this.basePath}/${id}`, {
        score: score,
      });

      // Transform response to match frontend ExaminationResult format
      const result: ExaminationResult = {
        id: updatedExam.id,
        score: score,
        totalQuestions: updatedExam.totalQuestions,
        correctAnswers: correctAnswers,
        incorrectAnswers: updatedExam.totalQuestions - correctAnswers,
        skippedAnswers: 0,
        timeSpent: submission.timeSpent || 0,
        completedAt: updatedExam.completedAt || new Date().toISOString(),
        updatedAt: updatedExam.updatedAt,
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
