import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsArray,
  IsObject,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ResultDisplayConfigDto {
  @IsBoolean()
  @IsOptional()
  showImmediately?: boolean;

  @IsBoolean()
  @IsOptional()
  showCorrectAnswers?: boolean;

  @IsBoolean()
  @IsOptional()
  showExplanation?: boolean;

  @IsBoolean()
  @IsOptional()
  showScoreBreakdown?: boolean;
}

export class SecurityConfigDto {
  @IsBoolean()
  @IsOptional()
  preventCopy?: boolean;

  @IsBoolean()
  @IsOptional()
  preventTabSwitch?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(60)
  timeoutWarning?: number;

  @IsBoolean()
  @IsOptional()
  shuffleOptions?: boolean;
}

export class CategoryDistributionDto {
  @IsInt()
  categoryId: number;

  @IsInt()
  @Min(1)
  count: number;
}

export class ConfigDto {
  @IsBoolean()
  @IsOptional()
  randomize?: boolean;

  @IsBoolean()
  @IsOptional()
  showCorrectAnswers?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CategoryDistributionDto)
  categoriesDistribution?: CategoryDistributionDto[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ResultDisplayConfigDto)
  resultDisplay?: ResultDisplayConfigDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => SecurityConfigDto)
  security?: SecurityConfigDto;
}

export class CreatePresetDto {
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

  @IsInt()
  @Min(1)
  totalQuestions: number;

  @IsInt()
  @Min(60) // At least 1 minute (60 seconds)
  durationSeconds: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  questionIds?: number[];

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  categoryIds?: number[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConfigDto)
  config?: ConfigDto;
}

export class UpdatePresetDto {
  @IsString()
  @IsOptional()
  title?: string;

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

  @IsInt()
  @IsOptional()
  @Min(1)
  totalQuestions?: number;

  @IsInt()
  @IsOptional()
  @Min(60) // At least 1 minute (60 seconds)
  durationSeconds?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  questionIds?: number[];

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  categoryIds?: number[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConfigDto)
  config?: ConfigDto;
}
