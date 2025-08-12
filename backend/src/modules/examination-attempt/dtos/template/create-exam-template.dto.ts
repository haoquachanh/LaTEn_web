import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsObject, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DifficultyLevel } from '@common/typings/question-type.enum';

class CategoryDistribution {
  @IsNumber()
  categoryId: number;

  @IsNumber()
  count: number;
}

class TemplateConfig {
  @IsBoolean()
  @IsOptional()
  randomize?: boolean;

  @IsBoolean()
  @IsOptional()
  showCorrectAnswers?: boolean;

  @IsNumber()
  @IsOptional()
  passingScore?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDistribution)
  @IsOptional()
  categoriesDistribution?: CategoryDistribution[];
}

export class CreateExamTemplateDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsNumber()
  totalQuestions: number;

  @IsNumber()
  durationSeconds: number;

  @IsArray()
  @IsOptional()
  questionIds?: number[];

  @IsObject()
  @ValidateNested()
  @Type(() => TemplateConfig)
  @IsOptional()
  config?: TemplateConfig;

  @IsObject()
  @IsOptional()
  questionFilters?: {
    categories?: number[];
    difficultyLevels?: (DifficultyLevel | string)[];
    types?: string[];
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
