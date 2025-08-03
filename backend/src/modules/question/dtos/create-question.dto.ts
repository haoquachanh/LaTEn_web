import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUrl,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, QuestionMode, QuestionFormat, DifficultyLevel } from '../../../entities/question.entity';
import { CreateQuestionOptionDto } from './question-option.dto';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsEnum(QuestionMode)
  mode: QuestionMode;

  @IsOptional()
  @IsEnum(QuestionFormat)
  format?: QuestionFormat;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsArray()
  acceptableAnswers?: string[];

  @IsOptional()
  @IsInt()
  points?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options?: CreateQuestionOptionDto[];
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsOptional()
  @IsEnum(QuestionMode)
  mode?: QuestionMode;

  @IsOptional()
  @IsEnum(QuestionFormat)
  format?: QuestionFormat;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsArray()
  acceptableAnswers?: string[];

  @IsOptional()
  @IsInt()
  points?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options?: CreateQuestionOptionDto[];
}
