import { IsNotEmpty, IsOptional, IsEnum, IsString, IsNumber, IsArray } from 'class-validator';
import { PostType } from '../../../entities/post.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  fullContent?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @IsOptional()
  @IsArray()
  tagIds?: number[];
}
