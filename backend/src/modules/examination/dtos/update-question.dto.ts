import { IsOptional, IsEnum, IsString, IsNumber, IsArray, Min, Max, IsInt, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
