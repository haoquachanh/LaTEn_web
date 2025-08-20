import { IsOptional, IsEnum, IsString, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { PostType } from '../../../entities/post.entity';

export class GetPostsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tagId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
