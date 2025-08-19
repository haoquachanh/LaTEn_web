import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Not, IsNull } from 'typeorm';
import { UserScore } from '@entities/user-score.entity';
import { UserEntity } from '@entities/user.entity';
import { Examination } from '@entities/examination.entity';
import { GetLeaderboardDto } from '../dtos/get-leaderboard.dto';
import { GetUserStatisticsDto } from '../dtos/get-user-statistics.dto';
import {
  LeaderboardResponse,
  UserStatisticsResponse,
  CategoryPerformance,
  ExamAttempt,
} from '../interfaces/api-response.interfaces';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(UserScore)
    private readonly userScoreRepo: Repository<UserScore>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(Examination)
    private readonly examinationRepo: Repository<Examination>,
  ) {}

  /**
   * Get leaderboard data based on time frame
   */
  async getLeaderboard(dto: GetLeaderboardDto, currentUserId?: number): Promise<LeaderboardResponse> {
    const { timeFrame = 'all', limit = 10, page = 1 } = dto;

    // Calculate the where clause based on time frame
    const whereClause = this.getTimeFrameWhereClause(timeFrame);

    // Get total count
    const totalUsers = await this.userScoreRepo.count({
      where: { timeFrame, ...whereClause },
    });

    // Get leaderboard users with pagination
    const scores = await this.userScoreRepo.find({
      where: { timeFrame, ...whereClause },
      relations: ['user'],
      order: { score: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    // Transform data for response
    const leaderboard = scores.map((score, index) => ({
      id: score.user.id,
      username: score.user.username,
      fullName: score.user.fullname || score.user.username,
      avatarUrl: null, // User entity doesn't have avatarUrl field yet
      score: +score.score, // Convert from Decimal to number
      examCount: score.examCount,
      rank: (page - 1) * limit + index + 1,
    }));

    let currentUserRank = null;

    // Get current user's rank if they are logged in
    if (currentUserId) {
      const userScore = await this.getUserRank(currentUserId, timeFrame);
      if (userScore) {
        currentUserRank = userScore;
      }
    }

    return {
      timeFrame,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      leaderboard,
      currentUserRank,
    };
  }

  /**
   * Get detailed statistics for a specific user
   */
  async getUserStatistics(userId: number, dto: GetUserStatisticsDto): Promise<UserStatisticsResponse> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get completed exams for this user
    const exams = await this.examinationRepo.find({
      where: {
        user: { id: userId },
        completedAt: Not(IsNull()), // Get only completed exams
        ...(dto.startDate && dto.endDate
          ? {
              completedAt: Between(new Date(dto.startDate), new Date(dto.endDate)),
            }
          : {}),
      },
      relations: ['examinationQuestions', 'examinationQuestions.question', 'examinationQuestions.question.category'],
      order: { completedAt: 'DESC' },
    });

    if (!exams.length) {
      return this.getEmptyStatisticsResponse();
    }

    // Calculate basic stats
    const totalExams = exams.length;
    const examScores = exams.map((exam) => exam.score);
    const averageScore = examScores.reduce((a, b) => a + b, 0) / totalExams;
    const bestScore = Math.max(...examScores);
    const examsPassed = exams.filter((exam) => exam.score >= 60).length;

    // Calculate total time spent
    const totalTimeSpent = exams.reduce((total, exam) => {
      const startedAt = new Date(exam.startedAt);
      const completedAt = new Date(exam.completedAt);
      return total + (completedAt.getTime() - startedAt.getTime()) / 1000;
    }, 0);

    // Get category performance
    const categoryPerformance = this.calculateCategoryPerformance(exams);

    // Get recent exam attempts
    const recentAttempts = this.mapRecentAttempts(exams.slice(0, 5));

    // Get user ranking
    const { rank, totalUsers } = await this.getUserRankingInfo(userId);

    // Calculate improvement rate (compare last 5 with previous 5)
    const improvementRate = this.calculateImprovementRate(exams);

    // Calculate streak days
    const streakDays = this.calculateStreakDays(exams);

    return {
      totalExams,
      averageScore,
      bestScore,
      examsPassed,
      totalTimeSpent,
      recentAttempts,
      categoryPerformance,
      rankingPosition: rank,
      totalUsers,
      improvementRate,
      streakDays,
    };
  }

  /**
   * Helper method to calculate category performance
   */
  private calculateCategoryPerformance(exams: Examination[]): CategoryPerformance[] {
    const categoryMap = new Map<string, { totalScore: number; count: number }>();

    exams.forEach((exam) => {
      exam.examinationQuestions.forEach((question) => {
        // Get the first category if available
        const category =
          question.question.categories?.length > 0 ? question.question.categories[0].name : 'Uncategorized';

        if (!categoryMap.has(category)) {
          categoryMap.set(category, { totalScore: 0, count: 0 });
        }

        const categoryData = categoryMap.get(category);
        categoryData.count += 1;

        // Add to score if the answer was correct
        if (question.isCorrect) {
          categoryData.totalScore += 1;
        }
      });
    });

    // Convert to array and calculate percentages
    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      score: Math.round((data.totalScore / data.count) * 100),
      count: data.count,
    }));
  }

  /**
   * Helper method to map exam attempts to API response format
   */
  private mapRecentAttempts(exams: Examination[]): ExamAttempt[] {
    return exams.map((exam) => {
      const startedAt = new Date(exam.startedAt);
      const completedAt = new Date(exam.completedAt);

      // Get the primary category (most frequent category in this exam)
      const categoryCount = new Map<string, number>();
      exam.examinationQuestions.forEach((q) => {
        // Get the first category if available
        const category = q.question.categories?.length > 0 ? q.question.categories[0].name : 'Uncategorized';
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      });

      let primaryCategory = 'Uncategorized';
      let maxCount = 0;

      categoryCount.forEach((count, category) => {
        if (count > maxCount) {
          maxCount = count;
          primaryCategory = category;
        }
      });

      return {
        id: exam.id,
        examName: exam.title,
        score: exam.score,
        totalQuestions: exam.totalQuestions,
        correctAnswers: exam.correctAnswers,
        timeSpent: (completedAt.getTime() - startedAt.getTime()) / 1000, // in seconds
        date: exam.completedAt.toISOString(),
        type: primaryCategory.toLowerCase(),
      };
    });
  }

  /**
   * Helper method to get user ranking information
   */
  private async getUserRankingInfo(userId: number): Promise<{ rank: number; totalUsers: number }> {
    const userScore = await this.userScoreRepo.findOne({
      where: { user: { id: userId }, timeFrame: 'all' },
    });

    if (!userScore) {
      return { rank: 0, totalUsers: await this.userRepo.count() };
    }

    // Count users with higher scores
    const higherScores = await this.userScoreRepo.count({
      where: { timeFrame: 'all', score: MoreThanOrEqual(userScore.score) },
    });

    return {
      rank: higherScores,
      totalUsers: await this.userRepo.count(),
    };
  }

  /**
   * Helper method to get a specific user's rank with full details
   */
  private async getUserRank(userId: number, timeFrame: string) {
    // Get the user's score record
    const userScore = await this.userScoreRepo.findOne({
      where: {
        user: { id: userId },
        timeFrame: timeFrame as 'all' | 'month' | 'week' | 'day',
      },
      relations: ['user'],
    });

    if (!userScore) {
      return null;
    }

    // Count users with higher scores to determine rank
    const higherScores = await this.userScoreRepo.count({
      where: {
        timeFrame: timeFrame as 'all' | 'month' | 'week' | 'day',
        score: MoreThanOrEqual(userScore.score),
      },
    });
    return {
      id: userScore.user.id,
      username: userScore.user.username,
      fullName: userScore.user.fullname || userScore.user.username,
      avatarUrl: null, // No avatarUrl field yet
      score: +userScore.score,
      examCount: userScore.examCount,
      rank: higherScores,
    };
  }

  /**
   * Helper method to calculate improvement rate
   */
  private calculateImprovementRate(exams: Examination[]): number {
    if (exams.length < 10) {
      return 0;
    }

    // Get average score of last 5 exams
    const recent5Avg = exams.slice(0, 5).reduce((sum, exam) => sum + exam.score, 0) / 5;

    // Get average score of previous 5 exams
    const previous5Avg = exams.slice(5, 10).reduce((sum, exam) => sum + exam.score, 0) / 5;

    // Calculate improvement rate as percentage
    if (previous5Avg === 0) return 0;
    return Math.round(((recent5Avg - previous5Avg) / previous5Avg) * 100);
  }

  /**
   * Helper method to calculate streak days
   */
  private calculateStreakDays(exams: Examination[]): number {
    if (!exams.length) return 0;

    const dates = exams.map((exam) => new Date(exam.completedAt).toISOString().split('T')[0]);
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Calculate streak of consecutive days
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i - 1]);
      const prev = new Date(uniqueDates[i]);

      // Check if dates are consecutive (1 day apart)
      const diffTime = current.getTime() - prev.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Helper method to create where clause based on time frame
   */
  private getTimeFrameWhereClause(timeFrame: string) {
    const now = new Date();

    switch (timeFrame) {
      case 'day':
        return { date: now };
      case 'week':
        const weekStart = startOfWeek(now);
        return { yearWeek: format(weekStart, 'YYYY-ww') };
      case 'month':
        return { yearMonth: format(now, 'YYYY-MM') };
      case 'all':
      default:
        return {};
    }
  }

  /**
   * Helper method to create date range where clause
   */
  private getDateRangeWhereClause(dto: GetUserStatisticsDto) {
    if (dto.startDate && dto.endDate) {
      return Between(new Date(dto.startDate), new Date(dto.endDate));
    }

    if (dto.startDate) {
      return MoreThanOrEqual(new Date(dto.startDate));
    }

    if (dto.endDate) {
      return LessThanOrEqual(new Date(dto.endDate));
    }

    return {};
  }

  /**
   * Helper method to provide an empty statistics response
   */
  private getEmptyStatisticsResponse(): UserStatisticsResponse {
    return {
      totalExams: 0,
      averageScore: 0,
      bestScore: 0,
      examsPassed: 0,
      totalTimeSpent: 0,
      recentAttempts: [],
      categoryPerformance: [],
      rankingPosition: 0,
      totalUsers: 0,
      improvementRate: 0,
      streakDays: 0,
    };
  }

  /**
   * Update user scores after exam completion
   */
  async updateUserScores(
    userId: number,
    examScore: number,
    correctAnswers: number,
    totalQuestions: number,
  ): Promise<void> {
    const now = new Date();

    // Update scores for all time frames
    await this.updateScoreForTimeFrame('all', userId, examScore, correctAnswers, totalQuestions);
    await this.updateScoreForTimeFrame(
      'month',
      userId,
      examScore,
      correctAnswers,
      totalQuestions,
      format(now, 'yyyy-MM'),
    );

    const weekStart = startOfWeek(now);
    await this.updateScoreForTimeFrame(
      'week',
      userId,
      examScore,
      correctAnswers,
      totalQuestions,
      null,
      format(weekStart, 'yyyy-ww'),
    );

    await this.updateScoreForTimeFrame('day', userId, examScore, correctAnswers, totalQuestions, null, null, now);
  }

  /**
   * Helper method to update score for a specific time frame
   */
  private async updateScoreForTimeFrame(
    timeFrame: 'all' | 'month' | 'week' | 'day',
    userId: number,
    examScore: number,
    correctAnswers: number,
    totalQuestions: number,
    yearMonth?: string,
    yearWeek?: string,
    date?: Date,
  ): Promise<void> {
    // Find existing score entry or create new one
    let userScore = await this.userScoreRepo.findOne({
      where: {
        user: { id: userId },
        timeFrame,
        ...(yearMonth && { yearMonth }),
        ...(yearWeek && { yearWeek }),
        ...(date && { date }),
      },
    });

    if (!userScore) {
      // Create a new user score entity
      userScore = new UserScore();
      userScore.user = { id: userId } as UserEntity;
      userScore.timeFrame = timeFrame;
      userScore.yearMonth = yearMonth;
      userScore.yearWeek = yearWeek;
      userScore.date = date;
      userScore.score = 0;
      userScore.examCount = 0;
      userScore.totalCorrectAnswers = 0;
      userScore.totalQuestions = 0;
    }

    // Update the score - we're using a weighted average
    const newExamCount = userScore.examCount + 1;
    const newTotalCorrect = userScore.totalCorrectAnswers + correctAnswers;
    const newTotalQuestions = userScore.totalQuestions + totalQuestions;

    // Calculate new weighted score
    const oldWeight = userScore.examCount / newExamCount;
    const newWeight = 1 / newExamCount;

    userScore.score = userScore.score * oldWeight + examScore * newWeight;
    userScore.examCount = newExamCount;
    userScore.totalCorrectAnswers = newTotalCorrect;
    userScore.totalQuestions = newTotalQuestions;

    await this.userScoreRepo.save(userScore);
  }
}
