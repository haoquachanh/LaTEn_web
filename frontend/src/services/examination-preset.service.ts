/**
 * Examination Preset Service
 *
 * Dịch vụ để quản lý và tương tác với API examination-presets
 */

import api from './api';
import { PresetExam } from '@/components/Examination/types';

/**
 * Interface cho API response của preset
 */
interface PresetResponse {
  data: PresetDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}

/**
 * Data transfer object cho preset từ backend
 */
interface PresetDto {
  id: number;
  title: string;
  description?: string;
  type?: string;
  content?: string;
  level?: string;
  totalQuestions: number;
  durationSeconds: number;
  isActive: boolean;
  isPublic: boolean;
  config?: {
    randomize?: boolean;
    showCorrectAnswers?: boolean;
    passingScore?: number;
    categoriesDistribution?: { categoryId: number; count: number }[];
    resultDisplay?: {
      showImmediately?: boolean;
      showCorrectAnswers?: boolean;
      showExplanation?: boolean;
      showScoreBreakdown?: boolean;
    };
    security?: {
      preventCopy?: boolean;
      preventTabSwitch?: boolean;
      timeoutWarning?: number;
      shuffleOptions?: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
  createdById?: number;
}

/**
 * Interface cho thông tin tạo hoặc cập nhật preset
 */
export interface PresetFormData {
  title: string;
  description?: string;
  type?: string;
  content?: string;
  level?: string;
  totalQuestions: number;
  durationSeconds: number;
  isActive?: boolean;
  isPublic?: boolean;
  questionIds?: number[];
  categoryIds?: number[];
  config?: {
    randomize?: boolean;
    showCorrectAnswers?: boolean;
    passingScore?: number;
    categoriesDistribution?: { categoryId: number; count: number }[];
    resultDisplay?: {
      showImmediately?: boolean;
      showCorrectAnswers?: boolean;
      showExplanation?: boolean;
      showScoreBreakdown?: boolean;
    };
    security?: {
      preventCopy?: boolean;
      preventTabSwitch?: boolean;
      timeoutWarning?: number;
      shuffleOptions?: boolean;
    };
  };
}

/**
 * Interface cho thông tin thống kê của preset
 */
export interface PresetStats {
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  passRate: number;
  recentAttempts: {
    id: number;
    userId: number;
    username: string;
    score: number;
    completedAt: string;
    timeSpent: number | null;
  }[];
}

/**
 * Dịch vụ quản lý các preset examination
 */
class ExaminationPresetService {
  private basePath = '/examination/presets';

  /**
   * Lấy danh sách các presets
   *
   * @param params Các tham số phân trang và lọc
   * @returns Promise với danh sách các preset đã chuyển đổi sang định dạng frontend
   */
  async getPresets(params?: {
    page?: number;
    limit?: number;
    search?: string;
    level?: string;
    isActive?: boolean;
    isPublic?: boolean;
  }): Promise<{
    data: PresetExam[];
    meta: { total: number; page: number; limit: number; totalPages?: number };
  }> {
    try {
      const response = await api.get<PresetResponse>(this.basePath, { params });

      // Chuyển đổi dữ liệu từ backend sang định dạng frontend
      const presets: PresetExam[] = response.data.data.map(this.mapPresetDtoToPresetExam);

      return {
        data: presets,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error('Error fetching examination presets:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách các preset công khai
   *
   * @param params Các tham số phân trang và lọc
   * @returns Promise với danh sách các preset công khai
   */
  async getPublicPresets(params?: { page?: number; limit?: number; search?: string; level?: string }): Promise<{
    data: PresetExam[];
    meta: { total: number; page: number; limit: number; totalPages?: number };
  }> {
    try {
      const response = await api.get<PresetResponse>(`${this.basePath}/public/available`, { params });

      // Chuyển đổi dữ liệu từ backend sang định dạng frontend
      const presets: PresetExam[] = response.data.data.map(this.mapPresetDtoToPresetExam);

      return {
        data: presets,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error('Error fetching public presets:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách các preset do người dùng hiện tại tạo
   *
   * @param params Các tham số phân trang
   * @returns Promise với danh sách các preset của người dùng
   */
  async getMyPresets(params?: { page?: number; limit?: number; search?: string }): Promise<{
    data: PresetExam[];
    meta: { total: number; page: number; limit: number; totalPages?: number };
  }> {
    try {
      const response = await api.get<PresetResponse>(`${this.basePath}/user/my-presets`, { params });

      // Chuyển đổi dữ liệu từ backend sang định dạng frontend
      const presets: PresetExam[] = response.data.data.map(this.mapPresetDtoToPresetExam);

      return {
        data: presets,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error('Error fetching user presets:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết một preset examination
   *
   * @param id ID của preset cần lấy chi tiết
   * @returns Promise với thông tin preset đã chuyển đổi sang định dạng frontend
   */
  async getPresetById(id: number | string): Promise<PresetExam> {
    try {
      const response = await api.get<PresetDto>(`${this.basePath}/${id}`);
      return this.mapPresetDtoToPresetExam(response.data);
    } catch (error) {
      console.error(`Error fetching preset ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo một preset examination mới
   *
   * @param data Thông tin của preset mới
   * @returns Promise với thông tin preset đã tạo
   */
  async createPreset(data: PresetFormData): Promise<PresetExam> {
    try {
      const response = await api.post<PresetDto>(this.basePath, data);
      return this.mapPresetDtoToPresetExam(response.data);
    } catch (error) {
      console.error('Error creating preset:', error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin một preset examination
   *
   * @param id ID của preset cần cập nhật
   * @param data Thông tin cập nhật
   * @returns Promise với thông tin preset đã cập nhật
   */
  async updatePreset(id: number | string, data: Partial<PresetFormData>): Promise<PresetExam> {
    try {
      const response = await api.put<PresetDto>(`${this.basePath}/${id}`, data);
      return this.mapPresetDtoToPresetExam(response.data);
    } catch (error) {
      console.error(`Error updating preset ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa một preset examination
   *
   * @param id ID của preset cần xóa
   * @returns Promise với kết quả xóa
   */
  async deletePreset(id: number | string): Promise<{ success: boolean }> {
    try {
      await api.delete(`${this.basePath}/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting preset ${id}:`, error);
      throw error;
    }
  }

  /**
   * Bắt đầu một bài thi từ preset
   *
   * @param id ID của preset
   * @returns Promise với thông tin bài thi đã bắt đầu
   */
  async startExamination(id: number | string): Promise<any> {
    try {
      const response = await api.post(`${this.basePath}/${id}/start`);
      return response.data;
    } catch (error) {
      console.error(`Error starting examination from preset ${id}:`, error);
      throw error;
    }
  }

  /**
   * Sao chép một preset
   *
   * @param id ID của preset cần sao chép
   * @returns Promise với thông tin preset đã sao chép
   */
  async clonePreset(id: number | string): Promise<PresetExam> {
    try {
      const response = await api.post<PresetDto>(`${this.basePath}/${id}/clone`);
      return this.mapPresetDtoToPresetExam(response.data);
    } catch (error) {
      console.error(`Error cloning preset ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cập nhật cấu hình hiển thị kết quả cho preset
   *
   * @param id ID của preset
   * @param config Cấu hình hiển thị kết quả
   * @returns Promise với thông tin preset đã cập nhật
   */
  async updateResultDisplayConfig(
    id: number | string,
    config: {
      showImmediately?: boolean;
      showCorrectAnswers?: boolean;
      showExplanation?: boolean;
      showScoreBreakdown?: boolean;
    },
  ): Promise<PresetExam> {
    try {
      const response = await api.put<PresetDto>(`${this.basePath}/${id}/result-display`, config);
      return this.mapPresetDtoToPresetExam(response.data);
    } catch (error) {
      console.error(`Error updating result display config for preset ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cập nhật cấu hình bảo mật cho preset
   *
   * @param id ID của preset
   * @param config Cấu hình bảo mật
   * @returns Promise với thông tin preset đã cập nhật
   */
  async updateSecurityConfig(
    id: number | string,
    config: {
      preventCopy?: boolean;
      preventTabSwitch?: boolean;
      timeoutWarning?: number;
      shuffleOptions?: boolean;
    },
  ): Promise<PresetExam> {
    try {
      const response = await api.put<PresetDto>(`${this.basePath}/${id}/security`, config);
      return this.mapPresetDtoToPresetExam(response.data);
    } catch (error) {
      console.error(`Error updating security config for preset ${id}:`, error);
      throw error;
    }
  }

  /**
   * Lấy thống kê về một preset
   *
   * @param id ID của preset
   * @returns Promise với thông tin thống kê
   */
  async getPresetStats(id: number | string): Promise<PresetStats> {
    try {
      const response = await api.get<PresetStats>(`${this.basePath}/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for preset ${id}:`, error);
      throw error;
    }
  }

  /**
   * Hàm helper để chuyển đổi từ PresetDto sang PresetExam
   */
  private mapPresetDtoToPresetExam(preset: PresetDto): PresetExam {
    return {
      id: preset.id.toString(),
      title: preset.title,
      description: preset.description || '',
      totalQuestions: preset.totalQuestions,
      durationSeconds: preset.durationSeconds,
      isActive: preset.isActive,
      isPublic: preset.isPublic,
      // Các trường từ backend
      type: preset.type || 'multiple',
      content: preset.content || 'reading',
      level: preset.level || 'medium',
      // Các trường tương thích với UI cũ
      questionsCount: preset.totalQuestions,
      time: Math.ceil(preset.durationSeconds / 60), // Chuyển từ giây sang phút
      config: preset.config,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };
  }
}

const examinationPresetService = new ExaminationPresetService();
export default examinationPresetService;
