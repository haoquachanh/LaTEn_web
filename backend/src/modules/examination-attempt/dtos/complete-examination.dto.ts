import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CompleteExaminationDto {
  @ApiProperty({
    description: 'ID of the examination to complete',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Examination ID must be an integer' })
  @IsPositive({ message: 'Examination ID must be a positive number' })
  examinationId: number;
}
