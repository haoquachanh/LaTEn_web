import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { EXAMINATION_CONSTANTS } from '@common/constants/examination.constants';

export class CreateExaminationDto {
  @IsOptional()
  @IsNumber({}, { message: 'User ID must be a valid number' })
  @Min(1, { message: 'User ID must be greater than 0' })
  userId?: number;

  @IsNotEmpty({ message: 'Total questions is required' })
  @IsNumber({}, { message: 'Total questions must be a number' })
  @Min(EXAMINATION_CONSTANTS.MIN_QUESTIONS, {
    message: `Total questions must be at least ${EXAMINATION_CONSTANTS.MIN_QUESTIONS}`,
  })
  @Max(EXAMINATION_CONSTANTS.MAX_QUESTIONS, {
    message: `Total questions cannot exceed ${EXAMINATION_CONSTANTS.MAX_QUESTIONS}`,
  })
  totalQuestions: number;

  @IsNotEmpty({ message: 'Duration is required' })
  @IsNumber({}, { message: 'Duration must be a number' })
  @Min(EXAMINATION_CONSTANTS.MIN_DURATION_SECONDS, {
    message: `Duration must be at least ${EXAMINATION_CONSTANTS.MIN_DURATION_SECONDS} seconds`,
  })
  @Max(EXAMINATION_CONSTANTS.MAX_DURATION_SECONDS, {
    message: `Duration cannot exceed ${EXAMINATION_CONSTANTS.MAX_DURATION_SECONDS} seconds`,
  })
  durationSeconds: number;

  @IsNotEmpty({ message: 'Start time is required' })
  @IsDateString({}, { message: 'Start time must be a valid ISO date string' })
  startedAt: Date;

  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(EXAMINATION_CONSTANTS.VALIDATION.TITLE_MIN_LENGTH, {
    message: `Title must be at least ${EXAMINATION_CONSTANTS.VALIDATION.TITLE_MIN_LENGTH} characters`,
  })
  @MaxLength(EXAMINATION_CONSTANTS.VALIDATION.TITLE_MAX_LENGTH, {
    message: `Title cannot exceed ${EXAMINATION_CONSTANTS.VALIDATION.TITLE_MAX_LENGTH} characters`,
  })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(EXAMINATION_CONSTANTS.VALIDATION.DESCRIPTION_MAX_LENGTH, {
    message: `Description cannot exceed ${EXAMINATION_CONSTANTS.VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
  })
  description?: string;
}
