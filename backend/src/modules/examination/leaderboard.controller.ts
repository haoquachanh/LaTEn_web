import { Controller, Get, Query, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@common/security/jwt.guard';
import { LeaderboardService } from './services/leaderboard.service';
import { GetLeaderboardDto } from './dtos/get-leaderboard.dto';
import { GetUserStatisticsDto } from './dtos/get-user-statistics.dto';
import { LeaderboardResponse, UserStatisticsResponse } from './interfaces/api-response.interfaces';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Leaderboards')
@ApiBearerAuth()
@Controller('leaderboards')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @ApiOperation({
    summary: 'Get leaderboard data',
    description:
      'Retrieve leaderboard rankings filtered by time frame. Can be used without authentication, but authenticated users will also see their own ranking.',
  })
  @ApiQuery({
    name: 'timeFrame',
    enum: ['all', 'month', 'week', 'day'],
    required: false,
    description: 'Filter leaderboard by time period',
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results to return (default: 10, max: 100)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination (default: 1)' })
  @ApiQuery({ name: 'category', required: false, description: 'Optional category filter' })
  @ApiOkResponse({
    description: 'Leaderboard data retrieved successfully',
    schema: {
      example: {
        timeFrame: 'all',
        totalUsers: 235,
        currentPage: 1,
        totalPages: 24,
        leaderboard: [
          {
            id: 1,
            username: 'language_master',
            fullName: 'John Doe',
            score: 980,
            examCount: 25,
            avatarUrl: null,
            rank: 1,
          },
          // More users...
        ],
        currentUserRank: {
          id: 42,
          username: 'current_user',
          fullName: 'Current User',
          score: 750,
          examCount: 18,
          avatarUrl: null,
          rank: 14,
        },
      },
    },
  })
  @Get()
  async getLeaderboard(@Query() query: GetLeaderboardDto, @Request() req): Promise<LeaderboardResponse> {
    // Pass the authenticated user's ID if available
    const userId = req.user?.id || null;
    return this.leaderboardService.getLeaderboard(query, userId);
  }

  @ApiOperation({
    summary: 'Get detailed statistics for the current user',
    description:
      'Retrieves comprehensive examination statistics for the currently authenticated user, including scores, history, and performance by category.',
  })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter statistics from this date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter statistics until this date (YYYY-MM-DD)' })
  @ApiQuery({
    name: 'timeFrame',
    required: false,
    enum: ['all', 'year', 'month', 'week', 'day'],
    description: 'Time frame for aggregating statistics',
  })
  @ApiQuery({
    name: 'detail',
    required: false,
    enum: ['basic', 'detailed'],
    description: 'Level of detail for the response',
  })
  @ApiOkResponse({
    description: 'User statistics retrieved successfully',
    schema: {
      example: {
        totalExams: 27,
        averageScore: 78.4,
        bestScore: 95,
        examsPassed: 24,
        totalTimeSpent: 63900,
        recentAttempts: [
          {
            id: 1,
            examName: 'Advanced Grammar Test',
            score: 85,
            totalQuestions: 30,
            correctAnswers: 25,
            timeSpent: 1800,
            date: '2025-09-15T14:30:00',
            type: 'grammar',
          },
          // More attempts...
        ],
        categoryPerformance: [
          {
            category: 'Grammar',
            score: 82,
            count: 8,
          },
          // More categories...
        ],
        rankingPosition: 7,
        totalUsers: 235,
        improvementRate: 5,
        streakDays: 3,
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('me/statistics')
  async getCurrentUserStatistics(
    @Query() query: GetUserStatisticsDto,
    @Request() req,
  ): Promise<UserStatisticsResponse> {
    return this.leaderboardService.getUserStatistics(req.user.id, query);
  }

  @ApiOperation({
    summary: 'Get detailed statistics for a specific user',
    description:
      "Retrieves comprehensive examination statistics for a specified user. Requires authentication, and appropriate permissions for accessing other users' data.",
  })
  @ApiParam({ name: 'userId', description: 'ID of the user to get statistics for' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter statistics from this date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter statistics until this date (YYYY-MM-DD)' })
  @ApiQuery({
    name: 'timeFrame',
    required: false,
    enum: ['all', 'year', 'month', 'week', 'day'],
    description: 'Time frame for aggregating statistics',
  })
  @ApiQuery({
    name: 'detail',
    required: false,
    enum: ['basic', 'detailed'],
    description: 'Level of detail for the response',
  })
  @ApiOkResponse({
    description: 'User statistics retrieved successfully',
    schema: {
      example: {
        totalExams: 27,
        averageScore: 78.4,
        bestScore: 95,
        examsPassed: 24,
        totalTimeSpent: 63900,
        recentAttempts: [
          {
            id: 1,
            examName: 'Advanced Grammar Test',
            score: 85,
            totalQuestions: 30,
            correctAnswers: 25,
            timeSpent: 1800,
            date: '2025-09-15T14:30:00',
            type: 'grammar',
          },
          // More attempts...
        ],
        categoryPerformance: [
          {
            category: 'Grammar',
            score: 82,
            count: 8,
          },
          // More categories...
        ],
        rankingPosition: 7,
        totalUsers: 235,
        improvementRate: 5,
        streakDays: 3,
      },
    },
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @UseGuards(JwtAuthGuard)
  @Get('users/:userId/statistics')
  async getUserStatistics(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: GetUserStatisticsDto,
  ): Promise<UserStatisticsResponse> {
    return this.leaderboardService.getUserStatistics(userId, query);
  }
}
