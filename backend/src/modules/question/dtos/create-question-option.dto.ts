import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateQuestionOptionDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}
