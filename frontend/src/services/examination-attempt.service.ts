/**
 * Examination Attempt Service
 *
 * Service để tương tác với API examination-attempt và examination-templates
 * Cung cấp các phương thức cho việc làm bài thi từ template
 */
import api from './api';
import { ExaminationResult, Examination, Question } from './types/examination.types';
import { PresetExam } from '@/components/Examination/types';

/**
 * Interface cho API response của template
 */
interface TemplateResponse {
  data: TemplateDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Data transfer object cho template từ backend
 */
interface TemplateDto {
  id: number;
  title: string;
  description?: string;
  totalQuestions: number;
  durationSeconds: number;
  isActive: boolean;
  config?: {
    randomize?: boolean;
    showCorrectAnswers?: boolean;
    passingScore?: number;
    categoriesDistribution?: { categoryId: number; count: number }[];
  };
  createdAt: string;
  updatedAt: string;
  createdById?: number;
}

/**
 * ExaminationAttemptService cung cấp các phương thức để tương tác với API làm bài thi
 */
class ExaminationAttemptService {
  private basePath = '/examination-attempt';
  private templatePath = '/examination-templates';

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
      const response = await api.get<TemplateResponse>(this.templatePath, { params });

      // Chuyển đổi dữ liệu từ backend sang định dạng frontend
      const templates: PresetExam[] = response.data.data.map(this.mapTemplateToPresetExam);

      return {
        data: templates,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error('Error fetching exam templates:', error);
      throw error;
    }
  }

  /**
   * Hàm helper để chuyển đổi từ TemplateDto sang PresetExam
   */
  private mapTemplateToPresetExam(template: TemplateDto): PresetExam {
    return {
      id: template.id.toString(),
      title: template.title,
      description: template.description || '',
      totalQuestions: template.totalQuestions,
      durationSeconds: template.durationSeconds,
      isActive: template.isActive,
      // Các trường tương thích với UI cũ
      type: 'multiple',
      questions: template.totalQuestions,
      questionsCount: template.totalQuestions,
      time: Math.ceil(template.durationSeconds / 60), // Chuyển từ giây sang phút
      content: 'reading',
      config: template.config,
      createdAt: template.createdAt,
    };
  }

  /**
   * Lấy thông tin chi tiết của một template
   *
   * @param id ID của template cần lấy chi tiết
   * @returns Promise với thông tin template đã chuyển đổi sang định dạng frontend
   */
  async getExamTemplateById(id: number | string): Promise<PresetExam> {
    try {
      const response = await api.get<TemplateDto>(`${this.templatePath}/${id}`);
      return this.mapTemplateToPresetExam(response.data);
    } catch (error) {
      console.error(`Error fetching exam template ${id}:`, error);
      throw error;
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
      const response = await api.post(`${this.basePath}/start`, {
        templateId: Number(templateId),
      });

      return this.mapResponseToExamination(response.data);
    } catch (error) {
      console.error(`Error starting examination with template ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Hàm helper để chuyển đổi response thành Examination
   *
   * @param data Dữ liệu từ API
   * @returns Đối tượng Examination đã được chuyển đổi
   */
  private mapResponseToExamination(data: any): Examination & { examinationQuestions?: any[] } {
    if (!data) return {} as Examination & { examinationQuestions?: any[] };

    // Chuyển đổi dữ liệu từ API sang model frontend
    const examination: Examination & { examinationQuestions?: any[] } = {
      id: data.id,
      title: data.title,
      description: data.description || '',
      durationSeconds: data.durationSeconds || 3600,
      duration: Math.ceil((data.durationSeconds || 3600) / 60), // Phút
      totalQuestions: data.totalQuestions || 0,
      type: data.type || 'multiple',
      content: data.content || 'reading',
      level: data.level || 'medium',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      startedAt: data.startedAt,
      completedAt: data.completedAt,
      questions: [],
      // Giữ lại dữ liệu gốc để xử lý trong context
      examinationQuestions: data.examinationQuestions || [],
    };

    // Nếu có questions từ API, chuyển đổi sang format frontend
    if (data.questions?.length > 0) {
      examination.questions = data.questions.map((q: any) => ({
        id: q.id.toString(),
        question: q.content || q.question || '',
        text: q.content || q.question || '',
        content: q.content || q.question || '',
        options: q.options || [],
        correctOption: q.correctOption,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        type: q.type || 'multiple_choice',
        mode: q.mode || 'text',
        format: q.format || 'text',
        difficultyLevel: q.difficultyLevel || 'medium',
        difficulty: q.difficulty || 'medium',
        points: q.points || 1,
        audioUrl: q.audioUrl || null,
      }));
    }

    return examination;
  }

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
      const response = await api.post(`${this.basePath}/${examinationId}/submit`, {
        questionId: Number(questionId),
        answer: answer,
      });

      return {
        success: true,
        isCorrect: response.data.isCorrect,
      };
    } catch (error) {
      console.error(`Error submitting answer for question ${questionId}:`, error);
      throw error;
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
      const response = await api.post(`${this.basePath}/${examinationId}/complete`);

      // Tính toán số câu hỏi bỏ qua (nếu API trả về)
      const skippedAnswers = response.data.skippedAnswers !== undefined ? response.data.skippedAnswers : 0;

      // Tính toán số câu trả lời sai dựa trên số câu đã trả lời, không tính câu bỏ qua
      const answeredQuestions = response.data.totalQuestions - skippedAnswers;
      const incorrectAnswers = answeredQuestions - response.data.correctAnswers;

      // Chuyển đổi kết quả về định dạng ExaminationResult
      const result: ExaminationResult = {
        id: response.data.id,
        score: response.data.score * 10, // Chuyển từ thang điểm 10 sang 100
        totalQuestions: response.data.totalQuestions,
        correctAnswers: response.data.correctAnswers,
        incorrectAnswers: incorrectAnswers,
        skippedAnswers: skippedAnswers,
        timeSpent: response.data.timeSpent || 0,
        completedAt: response.data.completedAt,
        updatedAt: response.data.updatedAt || new Date().toISOString(),
        // Thông tin bổ sung nếu có
        percentage: response.data.score * 10,
        isPassed: response.data.isPassed,
      };

      return result;
    } catch (error) {
      console.error(`Error completing examination ${examinationId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy bài thi hiện tại đang làm dở (nếu có)
   *
   * @returns Promise với thông tin bài thi hiện tại đang làm dở
   */
  async getCurrentExamination(): Promise<Examination | null> {
    try {
      const response = await api.get(`${this.basePath}/current`);
      if (!response.data) return null;

      return this.mapResponseToExamination(response.data);
    } catch (error) {
      console.error('Error fetching current examination:', error);

      // Nếu không có bài thi đang làm dở, trả về null thay vì throw error
      // Kiểm tra lỗi 404 (không tìm thấy bài thi đang làm dở)
      if (error instanceof Error && 'response' in (error as any) && (error as any).response?.status === 404) {
        return null;
      }

      throw error;
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
      const response = await api.get(`${this.basePath}/history`, {
        params: { page, limit },
      });

      // Chuyển đổi kết quả thành định dạng frontend
      const results: ExaminationResult[] = response.data.data.map((result: any) => ({
        id: result.id,
        score: result.score * 10, // Chuyển từ thang điểm 10 sang 100
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.totalQuestions - result.correctAnswers,
        skippedAnswers: 0,
        timeSpent: result.timeSpent || 0,
        isPassed: result.isPassed,
        percentage: result.score * 10,
        completedAt: result.completedAt,
        updatedAt: result.updatedAt,
        examination: result.examination,
      }));

      return {
        data: results,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error('Error fetching examination history:', error);
      throw error;
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
      const response = await api.get(`${this.basePath}/${examinationId}`);

      // Chuyển đổi kết quả thành định dạng frontend
      const result: ExaminationResult & { detailedResults: any[] } = {
        id: response.data.id,
        score: response.data.score * 10,
        totalQuestions: response.data.totalQuestions,
        correctAnswers: response.data.correctAnswers,
        incorrectAnswers: response.data.totalQuestions - response.data.correctAnswers,
        skippedAnswers: 0,
        timeSpent: response.data.timeSpent || 0,
        isPassed: response.data.isPassed,
        percentage: response.data.score * 10,
        completedAt: response.data.completedAt,
        updatedAt: response.data.updatedAt,
        examination: this.mapResponseToExamination(response.data.examination),
        detailedResults: response.data.detailedResults || [],
      };

      return result;
    } catch (error) {
      console.error(`Error fetching examination detail ${examinationId}:`, error);
      throw error;
    }
  }
}

const examinationAttemptService = new ExaminationAttemptService();
export default examinationAttemptService;
