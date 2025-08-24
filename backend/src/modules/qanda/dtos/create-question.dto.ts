import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { QuestionCategory } from '../../../entities/qanda-question.entity';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(QuestionCategory)
  @IsOptional()
  category?: QuestionCategory;

  @IsArray()
  @IsOptional()
  tagIds?: number[];
}
