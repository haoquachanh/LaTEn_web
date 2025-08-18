'use client';

/**
 * Service để quản lý dữ liệu bảng xếp hạng và thống kê với caching
 */

import { DashboardResponse } from './examination-dashboard.service';

export interface LeaderboardData {
  id: string;
  username: string;
  fullName: string;
  score: number;
  examCount: number;
  avatarUrl?: string | null;
  rank?: number;
  isCurrentUser?: boolean;
}

export interface StatisticsData {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  completionRate: number;
  totalTimeSpent: number; // in seconds
  recentImprovement: number;
  rankingPosition?: number;
  totalUsers?: number;
  // Nếu cần thêm thông tin về category performance, ta có thể thêm sau
}

class ExaminationStatsService {
  private readonly STORAGE_KEY = 'examination_dashboard_data';

  /**
   * Lấy dữ liệu thống kê từ dữ liệu dashboard đã lưu trong sessionStorage
   */
  async getStatisticsData(): Promise<StatisticsData> {
    const data = this.getCachedDashboardData();

    if (data?.userStats) {
      // Lấy dữ liệu từ userStats trong dashboard data
      const { totalExams, averageScore, bestScore, completionRate, totalTimeSpent, recentImprovement } = data.userStats;

      // Thêm thông tin về ranking nếu có
      let rankingPosition = undefined;
      let totalUsers = undefined;

      if (data.leaderboard && Array.isArray(data.leaderboard)) {
        // Tìm vị trí của người dùng hiện tại trong bảng xếp hạng
        const currentUser = data.leaderboard.find((user) => user.rank !== undefined);
        if (currentUser) {
          rankingPosition = currentUser.rank;
          totalUsers = data.leaderboard.length;
        }
      }

      return {
        totalExams: totalExams || 0,
        averageScore: averageScore || 0,
        bestScore: bestScore || 0,
        completionRate: completionRate || 0,
        totalTimeSpent: totalTimeSpent || 0,
        recentImprovement: recentImprovement || 0,
        rankingPosition,
        totalUsers,
      };
    }

    // Nếu không có dữ liệu, trả về một đối tượng trống
    return {
      totalExams: 0,
      averageScore: 0,
      bestScore: 0,
      completionRate: 0,
      totalTimeSpent: 0,
      recentImprovement: 0,
    };
  }

  /**
   * Lấy dữ liệu bảng xếp hạng từ dữ liệu dashboard đã lưu trong sessionStorage
   * @param timeFrame - Khung thời gian cho bảng xếp hạng ('all' | 'month' | 'week')
   */
  async getLeaderboardData(timeFrame: 'all' | 'month' | 'week' = 'all'): Promise<LeaderboardData[]> {
    const data = this.getCachedDashboardData();

    if (data?.leaderboard && Array.isArray(data.leaderboard)) {
      // Biến đổi leaderboard từ dashboard sang định dạng LeaderboardData
      const currentUserId = data.leaderboard.find((user) => user.rank === 1)?.userId; // Giả sử user hạng 1 là current user

      // Trong môi trường thực tế, thông tin currentUserId nên được lấy từ service auth

      return data.leaderboard.map((user) => ({
        id: String(user.userId),
        username: user.username,
        fullName: user.displayName,
        score: user.score,
        examCount: user.examCount,
        avatarUrl: user.avatarUrl,
        rank: user.rank,
        isCurrentUser: user.userId === currentUserId,
      }));
    }

    return [];
  }

  /**
   * Lấy dữ liệu dashboard từ sessionStorage
   */
  private getCachedDashboardData(): DashboardResponse | null {
    if (typeof window === 'undefined') return null;

    const savedData = sessionStorage.getItem(this.STORAGE_KEY);

    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (err) {
        console.error('Error parsing saved dashboard data:', err);
        return null;
      }
    }

    return null;
  }

  /**
   * Xóa cache dữ liệu dashboard
   */
  clearCache(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.STORAGE_KEY);
      console.log('Cleared examination dashboard cache');
    }
  }
}

const examinationStatsService = new ExaminationStatsService();
export default examinationStatsService;
