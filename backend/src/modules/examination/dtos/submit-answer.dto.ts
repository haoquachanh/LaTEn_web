import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsNumber()
  examinationId: number;

  @IsNotEmpty()
  @IsNumber()
  questionId: number;

  @IsNotEmpty()
  @IsString()
  userAnswer: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}
