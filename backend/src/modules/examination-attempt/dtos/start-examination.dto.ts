import { IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class StartExaminationDto {
  @IsNumber()
  @IsNotEmpty()
  templateId: number;
}
