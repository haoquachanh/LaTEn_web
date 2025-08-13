import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class ResultDisplayConfig {
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

class SecurityConfig {
  @IsBoolean()
  @IsOptional()
  preventCopy?: boolean;

  @IsBoolean()
  @IsOptional()
  preventTabSwitch?: boolean;

  @IsNumber()
  @IsOptional()
  timeoutWarning?: number;

  @IsBoolean()
  @IsOptional()
  shuffleOptions?: boolean;
}

class PresetConfig {
  @IsBoolean()
  @IsOptional()
  randomize?: boolean;

  @IsBoolean()
  @IsOptional()
  showCorrectAnswers?: boolean;

  @IsNumber()
  @IsOptional()
  passingScore?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ResultDisplayConfig)
  @IsOptional()
  resultDisplay?: ResultDisplayConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => SecurityConfig)
  @IsOptional()
  security?: SecurityConfig;
}

export class CreateExamPresetDto {
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
  durationSeconds: number;

  @IsArray()
  @IsNumber({}, { each: true })
  questionIds: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[];

  @IsObject()
  @ValidateNested()
  @Type(() => PresetConfig)
  @IsOptional()
  config?: PresetConfig;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
