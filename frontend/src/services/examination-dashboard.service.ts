/**
 * Examination Dashboard Service
 *
 * Service cung cấp các phương thức để tương tác với API dashboard tổng hợp
 * giúp giảm số lượng API calls cần thiết khi hiển thị dashboard
 */
import api from './api';
import { ExaminationResult, Examination } from './types/examination.types';

/**
 * Interface cho response của API dashboard
 */
export interface DashboardResponse {
  recentAttempts: {
    data: ExaminationResult[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  userStats: {
    totalExams: number;
    averageScore: number;
    bestScore: number;
    totalTimeSpent: number;
    completionRate: number;
    recentImprovement: number;
  };
  availableTemplates: {
    data: Examination[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  leaderboard: {
    userId: number;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    score: number;
    examCount: number;
    rank: number;
  }[];
  lastUpdated: string;
}

/**
 * ExaminationDashboardService cung cấp các phương thức để tương tác với API dashboard tổng hợp
 */
class ExaminationDashboardService {
  private basePath = '/examination/dashboard';

  /**
   * Lấy tất cả dữ liệu dashboard trong một lần gọi API
   * @returns Promise với dữ liệu dashboard tổng hợp
   */
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const response = await api.get<DashboardResponse>(this.basePath);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  /**
   * Tối ưu dữ liệu cho lần gọi API đầu tiên bằng cách lưu cache vào localStorage
   * @returns Promise với dữ liệu dashboard, có thể là từ cache hoặc từ API
   */
  async getOptimizedDashboardData(): Promise<DashboardResponse> {
    // Kiểm tra xem có cache trong localStorage không
    const cachedData = localStorage.getItem('examination_dashboard_data');
    const cachedTimestamp = localStorage.getItem('examination_dashboard_timestamp');

    // Nếu có cache và cache chưa quá 5 phút thì sử dụng cache
    if (cachedData && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 phút tính bằng milliseconds

      if (now - timestamp < fiveMinutes) {
        return JSON.parse(cachedData);
      }
    }

    // Nếu không có cache hoặc cache đã quá hạn, gọi API
    try {
      const data = await this.getDashboardData();

      // Lưu cache vào localStorage
      localStorage.setItem('examination_dashboard_data', JSON.stringify(data));
      localStorage.setItem('examination_dashboard_timestamp', Date.now().toString());

      return data;
    } catch (error) {
      // Nếu có lỗi và có cache cũ, sử dụng cache cũ
      if (cachedData) {
        console.warn('Using cached dashboard data due to API error');
        return JSON.parse(cachedData);
      }
      throw error;
    }
  }
}

const examinationDashboardService = new ExaminationDashboardService();
export default examinationDashboardService;
