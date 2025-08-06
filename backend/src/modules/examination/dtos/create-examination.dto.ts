import { IsNotEmpty, IsNumber, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateExaminationDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsNotEmpty()
  @IsNumber()
  totalQuestions: number;

  @IsNotEmpty()
  @IsNumber()
  durationSeconds: number;

  @IsNotEmpty()
  @IsDateString()
  startedAt: Date;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
