import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class StartExaminationDto {
  @ApiProperty({
    description: 'ID of the examination template to start',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Template ID must be an integer' })
  @IsPositive({ message: 'Template ID must be a positive number' })
  templateId: number;
}
