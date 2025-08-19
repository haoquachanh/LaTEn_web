import { IsDateString, IsOptional, IsEnum } from 'class-validator';

/**
 * DTO for user statistics query parameters
 */
export class GetUserStatisticsDto {
  /**
   * Start date for statistics period
   * Format: YYYY-MM-DD
   */
  @IsDateString()
  @IsOptional()
  startDate?: string;

  /**
   * End date for statistics period
   * Format: YYYY-MM-DD
   */
  @IsDateString()
  @IsOptional()
  endDate?: string;

  /**
   * Time frame for statistics aggregation
   */
  @IsEnum(['all', 'year', 'month', 'week', 'day'], { message: 'timeFrame must be one of: all, year, month, week, day' })
  @IsOptional()
  timeFrame?: 'all' | 'year' | 'month' | 'week' | 'day' = 'all';

  /**
   * Include detailed attempt data
   */
  @IsEnum(['basic', 'detailed'], { message: 'detail must be either basic or detailed' })
  @IsOptional()
  detail?: 'basic' | 'detailed' = 'basic';
}
