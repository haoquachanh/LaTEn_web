import { IsNotEmpty, IsOptional, IsNumber, IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitExaminationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpent?: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExaminationAnswerDto)
  answers: ExaminationAnswerDto[];
}

export class ExaminationAnswerDto {
  @IsNotEmpty()
  @IsInt()
  questionId: number;

  @IsOptional()
  @IsInt()
  selectedOptionId?: number;

  @IsOptional()
  answerText?: string;
}
