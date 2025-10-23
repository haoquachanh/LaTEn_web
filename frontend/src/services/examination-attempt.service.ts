/**
 * Examination Attempt Service
 *
 * Service để tương tác với API examination-attempt, examination-templates và examination-presets
 * Cung cấp các phương thức cho việc làm bài thi từ template hoặc preset
 */
import api from './api';
import { ExaminationResult, Examination, Question } from './types/examination.types';
import { PresetExam } from '@/components/Examination/types';
import { ExaminationError, ExaminationErrorCode, createExaminationError } from '@/utils/errors/ExaminationError';
import {
  TemplateApiResponse,
  ExaminationApiResponse,
  QuestionApiResponse,
  ExaminationResultApiResponse,
  PaginatedApiResponse,
  StartExaminationRequest,
  SubmitAnswerRequest,
  ExaminationQuestionApiResponse,
} from '@/types/examination-api.types';
import {
  normalizeScore,
  parseId,
  mapTemplateToPresetExam,
  mapExaminationApiToExamination,
  mapExaminationResultApiToResult,
} from '@/utils/examination.helpers';

/**
 * ExaminationAttemptService cung cấp các phương thức để tương tác với API làm bài thi
 */
class ExaminationAttemptService {
  private basePath = '/examination-attempt';
  private templatePath = '/examination-templates';
  private presetPath = '/examinations/presets';

  /**
   * Lấy danh sách các bài thi mẫu (templates)
   *
   * @param params Các tham số phân trang và lọc
   * @returns Promise với danh sách các template đã chuyển đổi sang định dạng frontend
   */
  async getExamTemplates(params?: { page?: number; limit?: number; search?: string; activeOnly?: boolean }): Promise<{
    data: PresetExam[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<TemplateApiResponse>>(this.templatePath, { params });

      // Chuyển đổi dữ liệu từ backend sang định dạng frontend (sử dụng helper)
      const templates: PresetExam[] = response.data.data.map(mapTemplateToPresetExam);

      return { data: templates, meta: response.data.meta };
    } catch (error) {
      console.error('Error fetching exam templates:', error);
      throw createExaminationError(error);
    }
  }

  /**
   * Hàm helper để chuyển đổi từ TemplateApiResponse sang PresetExam
   */
  // mapping chuyển sang helper: mapTemplateToPresetExam

  /**
   * Lấy thông tin chi tiết của một template
   *
   * @param id ID của template cần lấy chi tiết
   * @returns Promise với thông tin template đã chuyển đổi sang định dạng frontend
   */
  async getExamTemplateById(id: number | string): Promise<PresetExam> {
    try {
      const response = await api.get<TemplateApiResponse>(`${this.templatePath}/${parseId(id)}`);
      return mapTemplateToPresetExam(response.data);
    } catch (error) {
      console.error(`Error fetching exam template ${id}:`, error);
      throw new ExaminationError(`Failed to fetch exam template ${id}`, ExaminationErrorCode.TEMPLATE_NOT_FOUND, 404);
    }
  }

  /**
   * Bắt đầu làm bài thi từ một template
   *
   * @param templateId ID của template để bắt đầu bài thi
   * @returns Promise với thông tin bài thi đã bắt đầu bao gồm danh sách câu hỏi
   */
  async startExamination(templateId: number | string): Promise<Examination> {
    try {
      const requestData: StartExaminationRequest = {
        templateId: parseId(templateId),
      };

      const response = await api.post<ExaminationApiResponse>(`${this.basePath}/start`, requestData);

      return mapExaminationApiToExamination(response.data);
    } catch (error) {
      console.error(`Error starting examination with template ${templateId}:`, error);
      throw new ExaminationError(
        `Failed to start examination with template ${templateId}`,
        ExaminationErrorCode.START_EXAM_FAILED,
        500,
      );
    }
  }

  /**
   * Hàm helper để chuyển đổi response thành Examination
   *
   * @param data Dữ liệu từ API
   * @returns Đối tượng Examination đã được chuyển đổi
   */
  // mapResponseToExamination moved to helper: mapExaminationApiToExamination

  /**
   * Gửi câu trả lời cho một câu hỏi trong bài thi
   *
   * @param examinationId ID của bài thi
   * @param questionId ID của câu hỏi
   * @param answer Câu trả lời của người dùng
   * @returns Promise với kết quả của việc gửi câu trả lời
   */
  async submitAnswer(
    examinationId: number | string,
    questionId: number | string,
    answer: string | number | boolean | Array<string | number>,
  ): Promise<{ success: boolean; isCorrect?: boolean }> {
    try {
      const requestData: SubmitAnswerRequest = {
        questionId: parseId(questionId),
        answer: answer,
      };

      const response = await api.post<{ isCorrect: boolean }>(
        `${this.basePath}/${parseId(examinationId)}/submit`,
        requestData,
      );

      return {
        success: true,
        isCorrect: response.data.isCorrect,
      };
    } catch (error) {
      console.error(`Error submitting answer for question ${questionId}:`, error);
      throw new ExaminationError(
        `Failed to submit answer for question ${questionId}`,
        ExaminationErrorCode.SUBMIT_ANSWER_FAILED,
        500,
      );
    }
  }

  /**
   * Hoàn thành bài thi và lấy kết quả
   *
   * @param examinationId ID của bài thi
   * @returns Promise với kết quả của bài thi
   */
  async completeExamination(examinationId: number | string): Promise<ExaminationResult> {
    try {
      const response = await api.post<ExaminationResultApiResponse>(
        `${this.basePath}/${parseId(examinationId)}/complete`,
      );
      return mapExaminationResultApiToResult(response.data);
    } catch (error) {
      console.error(`Error completing examination ${examinationId}:`, error);
      throw new ExaminationError(
        `Failed to complete examination ${examinationId}`,
        ExaminationErrorCode.SUBMIT_EXAM_FAILED,
        500,
      );
    }
  }

  /**
   * Lấy bài thi hiện tại đang làm dở (nếu có)
   *
   * @returns Promise với thông tin bài thi hiện tại đang làm dở
   */
  async getCurrentExamination(): Promise<Examination | null> {
    try {
      const response = await api.get<ExaminationApiResponse>(`${this.basePath}/current`);
      if (!response.data) return null;

      return mapExaminationApiToExamination(response.data);
    } catch (error: any) {
      console.error('Error fetching current examination:', error);

      // Nếu không có bài thi đang làm dở, trả về null thay vì throw error
      // Kiểm tra lỗi 404 (không tìm thấy bài thi đang làm dở)
      if (error.response?.status === 404) {
        return null;
      }

      throw createExaminationError(error);
    }
  }

  /**
   * Lấy lịch sử làm bài thi của người dùng
   *
   * @param page Trang dữ liệu
   * @param limit Số lượng kết quả mỗi trang
   * @returns Promise với danh sách kết quả bài thi đã làm
   */
  async getExaminationHistory(
    page = 1,
    limit = 10,
  ): Promise<{
    data: ExaminationResult[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<ExaminationResultApiResponse>>(`${this.basePath}/history`, {
        params: { page, limit },
      });
      const results: ExaminationResult[] = response.data.data.map(mapExaminationResultApiToResult);
      return { data: results, meta: response.data.meta };
    } catch (error) {
      console.error('Error fetching examination history:', error);
      throw createExaminationError(error);
    }
  }

  /**
   * Lấy chi tiết một bài thi đã làm
   *
   * @param examinationId ID của bài thi cần lấy chi tiết
   * @returns Promise với thông tin chi tiết của bài thi và kết quả
   */
  async getExaminationDetail(examinationId: number | string): Promise<
    ExaminationResult & {
      detailedResults: Array<{
        questionId: number;
        isCorrect: boolean;
        selectedOption: number | string | null;
        correctOption: number | string | null;
        question?: Question;
      }>;
    }
  > {
    try {
      const response = await api.get<ExaminationResultApiResponse>(`${this.basePath}/${examinationId}`);
      const mapped = mapExaminationResultApiToResult(response.data);

      // Normalize detailedResults to frontend shape: convert selectedOption/correctOption to numbers
      const detailedResults = (response.data.detailedResults || []).map((d) => {
        const parseOption = (opt: number | string | null | undefined): number => {
          if (opt === null || opt === undefined) return -1;
          if (typeof opt === 'number') return opt;
          const n = Number(opt);
          return Number.isNaN(n) ? -1 : n;
        };

        return {
          questionId: d.questionId,
          isCorrect: d.isCorrect,
          selectedOption: parseOption(d.selectedOption) as number,
          correctOption: parseOption(d.correctOption) as number,
          question: d.question ? (mapExaminationApiToExamination as any) : undefined,
        };
      });

      const result: ExaminationResult & { detailedResults: any[] } = {
        ...mapped,
        examination: response.data.examination
          ? mapExaminationApiToExamination(response.data.examination as ExaminationApiResponse)
          : undefined,
        detailedResults,
      };

      return result;
    } catch (error) {
      console.error(`Error fetching examination detail ${examinationId}:`, error);
      throw new ExaminationError(
        `Failed to fetch examination detail ${examinationId}`,
        ExaminationErrorCode.EXAM_NOT_FOUND,
        404,
      );
    }
  }
}

const examinationAttemptService = new ExaminationAttemptService();
export default examinationAttemptService;
