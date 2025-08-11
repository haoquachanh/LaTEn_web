import { IsOptional, IsNumber, IsEnum, IsString, IsBoolean } from 'class-validator';

export enum ExamTemplateSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc',
  DURATION_ASC = 'duration_asc',
  DURATION_DESC = 'duration_desc',
}

export class GetExamTemplatesDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(ExamTemplateSort)
  @IsOptional()
  sort?: ExamTemplateSort = ExamTemplateSort.NEWEST;

  @IsBoolean()
  @IsOptional()
  activeOnly?: boolean = true;
}

// Helper function to convert enum value to SQL ORDER BY clause
export function getSortOrder(sort: ExamTemplateSort): string {
  switch (sort) {
    case ExamTemplateSort.NEWEST:
      return 'createdAt DESC';
    case ExamTemplateSort.OLDEST:
      return 'createdAt ASC';
    case ExamTemplateSort.TITLE_ASC:
      return 'title ASC';
    case ExamTemplateSort.TITLE_DESC:
      return 'title DESC';
    case ExamTemplateSort.DURATION_ASC:
      return 'durationSeconds ASC';
    case ExamTemplateSort.DURATION_DESC:
      return 'durationSeconds DESC';
    default:
      return 'createdAt DESC';
  }
}
