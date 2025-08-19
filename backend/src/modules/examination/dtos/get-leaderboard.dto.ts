import { IsEnum, IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for leaderboard query parameters
 */
export class GetLeaderboardDto {
  /**
   * Time frame for leaderboard data
   * all: All-time scores
   * month: Scores for the current month
   * week: Scores for the current week
   */
  @IsEnum(['all', 'month', 'week', 'day'], { message: 'timeFrame must be one of: all, month, week, day' })
  @IsOptional()
  timeFrame?: 'all' | 'month' | 'week' | 'day' = 'all';

  /**
   * Number of users to return in the leaderboard (limit)
   */
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  /**
   * Page number for pagination
   */
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  page?: number = 1;

  /**
   * Optional category filter for leaderboard
   */
  @IsString()
  @IsOptional()
  category?: string;
}
