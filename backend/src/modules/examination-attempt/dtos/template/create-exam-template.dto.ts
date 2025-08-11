import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

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
}
