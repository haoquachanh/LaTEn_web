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
import { DifficultyLevel, QuestionMode, QuestionType } from '@common/typings/question-type.enum';
import { CreateQuestionOptionDto } from './create-question-option.dto';
import { UserEntity } from '@entities/user.entity';

class QuestionOptionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsEnum(QuestionMode)
  mode: QuestionMode;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficultyLevel?: DifficultyLevel;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @IsUrl()
  @IsOptional()
  audioUrl?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  @IsOptional()
  options?: CreateQuestionOptionDto[];

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @IsOptional()
  createdBy?: UserEntity;
}
