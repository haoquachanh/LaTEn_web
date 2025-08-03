import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
import { QuestionType, QuestionMode } from '../../../entities/question.entity';

export class CreateExaminationDto {
  @IsNotEmpty()
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsNotEmpty()
  @IsEnum(QuestionMode)
  mode: QuestionMode;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  totalQuestions: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  durationSeconds: number;
}

export class SubmitExaminationDto {
  @IsNotEmpty()
  examinationId: number;

  @IsNotEmpty()
  answers: ExaminationAnswerDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpent?: number;
}

export class ExaminationAnswerDto {
  @IsNotEmpty()
  questionId: number;

  @IsOptional()
  selectedOptionId?: number;

  @IsOptional()
  answerText?: string;
}
