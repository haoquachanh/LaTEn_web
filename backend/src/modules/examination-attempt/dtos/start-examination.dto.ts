import { IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class StartExaminationDto {
  @IsNumber()
  @IsOptional()
  examId?: number;

  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  durationSeconds?: number;
}
