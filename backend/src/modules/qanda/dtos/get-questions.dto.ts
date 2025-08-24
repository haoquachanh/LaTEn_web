import { IsOptional, IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionCategory } from '../../../entities/qanda-question.entity';

export class GetQuestionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(QuestionCategory)
  category?: QuestionCategory;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tagId?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: 'answered' | 'unanswered' | 'all';
}
