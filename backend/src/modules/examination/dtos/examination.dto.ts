import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsInt, Min, IsString, IsArray } from 'class-validator';
import { QuestionType, QuestionMode, DifficultyLevel } from '../../../entities/question.entity';

export class CreateExaminationDto {
  @IsNotEmpty()
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsNotEmpty()
  @IsEnum(QuestionMode)
  mode: QuestionMode;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalQuestions: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  durationSeconds: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficultyLevel?: DifficultyLevel;

  @IsOptional()
  @IsArray()
  questionIds?: number[];
}

export class UpdateExaminationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  questionType?: QuestionType;

  @IsOptional()
  @IsEnum(QuestionMode)
  mode?: QuestionMode;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalQuestions?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationSeconds?: number;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficultyLevel?: DifficultyLevel;

  @IsOptional()
  @IsArray()
  questionIds?: number[];
}

export class PresetExaminationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalQuestions: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  duration: number;
}

export class ExaminationResultDto {
  @IsNotEmpty()
  examinationId: number;

  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsNotEmpty()
  @IsNumber()
  correctAnswers: number;

  @IsNotEmpty()
  @IsNumber()
  totalQuestions: number;

  @IsOptional()
  @IsNumber()
  timeSpent?: number;
}
