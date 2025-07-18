import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateReplyDto {
  @IsOptional()
  @IsString()
  content?: string;
}
