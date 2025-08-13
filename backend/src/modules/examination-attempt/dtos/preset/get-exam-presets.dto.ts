import { IsOptional, IsNumber, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum ExamPresetSort {
  CREATED_AT_ASC = 'created_at_asc',
  CREATED_AT_DESC = 'created_at_desc',
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc',
  LEVEL_ASC = 'level_asc',
  LEVEL_DESC = 'level_desc',
}

export function getPresetSortOrder(sort: ExamPresetSort | undefined) {
  switch (sort) {
    case ExamPresetSort.CREATED_AT_ASC:
      return { createdAt: 'ASC' };
    case ExamPresetSort.CREATED_AT_DESC:
      return { createdAt: 'DESC' };
    case ExamPresetSort.TITLE_ASC:
      return { title: 'ASC' };
    case ExamPresetSort.TITLE_DESC:
      return { title: 'DESC' };
    case ExamPresetSort.LEVEL_ASC:
      return { level: 'ASC' };
    case ExamPresetSort.LEVEL_DESC:
      return { level: 'DESC' };
    default:
      return { createdAt: 'DESC' }; // Default sort
  }
}

export class GetExamPresetsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPublic?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(ExamPresetSort)
  sort?: ExamPresetSort = ExamPresetSort.CREATED_AT_DESC;
}
