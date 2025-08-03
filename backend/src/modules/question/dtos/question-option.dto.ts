import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateQuestionOptionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}

export class UpdateQuestionOptionDto {
  @IsString()
  text?: string;

  @IsBoolean()
  isCorrect?: boolean;
}
