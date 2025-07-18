import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, Min, Max, IsInt, IsUrl } from 'class-validator';
import { QuestionType, QuestionFormat, DifficultyLevel } from '../../../entities/question.entity';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsEnum(QuestionFormat)
  format: QuestionFormat;

  @IsEnum(DifficultyLevel)
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty: DifficultyLevel;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  acceptableAnswers?: string[];

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  points?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  passage?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  timeLimit?: number;

  @IsOptional()
  @IsNumber()
  examinationId?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  questionBankId?: number;

  @IsOptional()
  metadata?: Record<string, any>;
}
