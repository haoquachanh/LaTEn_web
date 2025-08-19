/**
 * Interface for leaderboard user data
 */
export interface LeaderboardUser {
  id: number;
  username: string;
  fullName: string;
  avatarUrl?: string;
  score: number;
  examCount: number;
  rank: number;
}

/**
 * Interface for leaderboard response
 */
export interface LeaderboardResponse {
  timeFrame: 'all' | 'month' | 'week' | 'day';
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  leaderboard: LeaderboardUser[];
  currentUserRank?: LeaderboardUser;
}

/**
 * Interface for exam attempt data
 */
export interface ExamAttempt {
  id: number;
  examName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  date: string;
  type: string;
}

/**
 * Interface for category performance data
 */
export interface CategoryPerformance {
  category: string;
  score: number;
  count: number;
}

/**
 * Interface for user statistics response
 */
export interface UserStatisticsResponse {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  examsPassed: number;
  totalTimeSpent: number; // in seconds
  recentAttempts: ExamAttempt[];
  categoryPerformance: CategoryPerformance[];
  rankingPosition: number;
  totalUsers: number;
  improvementRate?: number; // percentage improvement over time
  streakDays?: number; // consecutive days with exam attempts
}
