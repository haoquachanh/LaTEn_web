import { IsOptional, IsString } from 'class-validator';

export class UpdateExaminationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
