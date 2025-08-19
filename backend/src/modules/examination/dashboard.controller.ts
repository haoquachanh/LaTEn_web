import { Controller, Get, UseGuards, Query, Req, HttpStatus, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ExaminationService } from './examination.service';
import { ExaminationAttemptService } from '../examination-attempt/examination-attempt.service';
import { ExaminationTemplateService } from './services/examination-template.service';
import { LeaderboardService } from './services/leaderboard.service';
import { PaginationParams } from '../../common/typings/pagination-params';

@ApiTags('examination-dashboard')
@Controller('examination/dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly examinationService: ExaminationService,
    private readonly examinationAttemptService: ExaminationAttemptService,
    private readonly examinationTemplateService: ExaminationTemplateService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all dashboard data in one request' })
  @ApiResponse({ status: 200, description: 'Return dashboard data' })
  async getDashboardData(@Req() req: Request, @Query() pagination?: PaginationParams) {
    try {
      const userId = req.user['id'];

      if (!userId) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      // Set reasonable defaults for pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 5; // Reduced limit for dashboard view

      // Get all data in parallel for performance
      const [recentAttempts, availableTemplates, topScores] = await Promise.all([
        // Get recent examination attempts
        this.examinationAttemptService.getUserExaminationHistory(userId, page, limit),

        // Get available examination templates
        this.examinationTemplateService.findAll({
          page: 1,
          limit: 10,
          isActive: true,
        }),

        // Get leaderboard data
        this.leaderboardService.getLeaderboard({ timeFrame: 'all', limit: 5, page: 1 }),
      ]);

      // User statistics - temporarily set to placeholder data
      const userStats = {
        totalExams: recentAttempts.data.length,
        averageScore:
          recentAttempts.data.length > 0
            ? recentAttempts.data.reduce((sum, exam) => sum + exam.score, 0) / recentAttempts.data.length
            : 0,
        completedExams: recentAttempts.data.length,
      };

      return {
        recentAttempts,
        userStats,
        availableTemplates,
        leaderboard: topScores,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || 'Error fetching dashboard data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
