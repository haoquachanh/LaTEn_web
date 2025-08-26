import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtOptionalGuard } from '../auth/guards/jwt-optional.guard';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { CreateTagDto } from './dtos/create-tag.dto';
import { PostService } from './post.service';
import { PaginatedResponse } from './interfaces/paginated-response.interface';
import { PostResponse, PostDetailResponse } from './interfaces/post-response.interface';
import { TagResponse } from './interfaces/tag-response.interface';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Req() req, @Body() createPostDto: CreatePostDto): Promise<any> {
    const userId = req.user.id;
    const post = await this.postService.createPost(userId, createPostDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Post created successfully',
      data: post,
    };
  }

  @Get()
  @UseGuards(JwtOptionalGuard)
  async getAllPosts(@Req() req, @Query() queryParams: GetPostsDto): Promise<any> {
    const userId = req.user?.id;
    const posts = await this.postService.getAllPosts(queryParams, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Posts retrieved successfully',
      data: posts,
    };
  }

  @Get(':id')
  @UseGuards(JwtOptionalGuard)
  async getPostById(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user?.id;
    const post = await this.postService.getPostById(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Post retrieved successfully',
      data: post,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(@Req() req, @Param('id') id: number, @Body() updatePostDto: UpdatePostDto): Promise<any> {
    const userId = req.user.id;
    const post = await this.postService.updatePost(userId, id, updatePostDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Post updated successfully',
      data: post,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.id;
    await this.postService.deletePost(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Post deleted successfully',
    };
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.id;
    const result = await this.postService.likePost(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result,
    };
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.id;
    const result = await this.postService.unlikePost(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Post unliked successfully',
      data: result,
    };
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(@Req() req, @Param('id') id: number, @Body() body: { content: string }): Promise<any> {
    const userId = req.user.id;
    const comment = await this.postService.addComment(userId, id, body.content);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comment added successfully',
      data: comment,
    };
  }

  @Get(':id/comments')
  async getComments(@Param('id') id: number): Promise<any> {
    const comments = await this.postService.getComments(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Comments retrieved successfully',
      data: comments,
    };
  }

  // Tag endpoints

  @Post('tags')
  @UseGuards(JwtAuthGuard)
  async createTag(@Body() createTagDto: CreateTagDto): Promise<any> {
    const tag = await this.postService.createTag(createTagDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tag created successfully',
      data: tag,
    };
  }

  @Get('tags')
  async getAllTags(): Promise<any> {
    const tags = await this.postService.getAllTags();
    return {
      statusCode: HttpStatus.OK,
      message: 'Tags retrieved successfully',
      data: tags,
    };
  }
}
