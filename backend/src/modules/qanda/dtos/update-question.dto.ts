import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { QuestionCategory } from '../../../entities/qanda-question.entity';

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(QuestionCategory)
  @IsOptional()
  category?: QuestionCategory;

  @IsArray()
  @IsOptional()
  tagIds?: number[];
}
