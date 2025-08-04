import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { QuestionType, QuestionMode, DifficultyLevel } from '@entities/question.entity';

/**
 * DTO for starting an examination with custom parameters
 */
export class StartExaminationDto {
  @IsOptional()
  @IsNumber()
  questionsCount?: number;

  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsOptional()
  @IsEnum(QuestionMode)
  content?: QuestionMode;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  level?: DifficultyLevel;
}
