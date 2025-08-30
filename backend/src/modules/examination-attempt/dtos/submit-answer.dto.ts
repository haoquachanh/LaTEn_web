import { IsNotEmpty, IsInt, IsPositive, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'ID of the question being answered',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Question ID must be an integer' })
  @IsPositive({ message: 'Question ID must be a positive number' })
  questionId: number;

  @ApiProperty({
    description: 'User answer (can be string, number, or array)',
    example: 'A',
  })
  @IsNotEmpty({ message: 'Answer cannot be empty' })
  answer: string | number | string[];

  @ApiPropertyOptional({
    description: 'Version for optimistic locking',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  version?: number;

  @ApiPropertyOptional({
    description: 'Idempotency key to prevent duplicate submissions',
    example: 'uuid-123-456',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  idempotencyKey?: string;
}
