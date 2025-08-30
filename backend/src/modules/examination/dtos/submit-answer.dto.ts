import { IsNotEmpty, IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty({ message: 'Examination ID is required' })
  @IsNumber({}, { message: 'Examination ID must be a valid number' })
  @Min(1, { message: 'Examination ID must be greater than 0' })
  examinationId: number;

  @IsNotEmpty({ message: 'Question ID is required' })
  @IsNumber({}, { message: 'Question ID must be a valid number' })
  @Min(1, { message: 'Question ID must be greater than 0' })
  questionId: number;

  @IsNotEmpty({ message: 'Answer is required' })
  @IsString({ message: 'Answer must be a string' })
  userAnswer: string;

  @IsNotEmpty({ message: 'Correctness flag is required' })
  @IsBoolean({ message: 'isCorrect must be a boolean value' })
  isCorrect: boolean;
}
