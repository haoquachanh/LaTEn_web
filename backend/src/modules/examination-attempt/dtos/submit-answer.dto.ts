import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubmitAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @IsNotEmpty()
  answer: string | number | string[]; // Tuỳ vào loại câu hỏi (trắc nghiệm, tự luận, nhiều lựa chọn...)
}
