import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExamTemplateDto } from './create-exam-template.dto';

export class UpdateExamTemplateDto extends CreateExamTemplateDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
