import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '@common/security/jwt.guard';
import { Comment, CommentType } from '@entities/comment.entity';
import { CommentReply } from '@entities/comment-reply.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Get all comments with pagination' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  async getAllComments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ comments: Comment[]; total: number }> {
    return this.commentService.getAllComments(page, limit);
  }

  @ApiOperation({ summary: 'Get comments by entity (e.g., examination, course)' })
  @ApiResponse({ status: 200, description: 'List of comments for specific entity' })
  @Get('entity/:entityType/:entityId')
  async getCommentsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ comments: Comment[]; total: number }> {
    return this.commentService.getCommentsByEntity(entityType, entityId, page, limit);
  }

  @ApiOperation({ summary: 'Get comments by type' })
  @ApiResponse({ status: 200, description: 'List of comments by type' })
  @Get('type/:type')
  async getCommentsByType(
    @Param('type') type: CommentType,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ comments: Comment[]; total: number }> {
    return this.commentService.getCommentsByType(type, page, limit);
  }

  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment details' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @Get(':id')
  async getCommentById(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.getCommentById(id);
  }

  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Body(ValidationPipe) commentData: Partial<Comment>, @Request() req): Promise<Comment> {
    return this.commentService.createComment(commentData, req.user.id);
  }

  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateData: Partial<Comment>,
    @Request() req,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, updateData, req.user.id);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    await this.commentService.deleteComment(id, req.user.id);
    return { message: 'Comment deleted successfully' };
  }

  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({ status: 200, description: 'Comment liked successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @Post(':id/like')
  async likeComment(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.likeComment(id);
  }

  @ApiOperation({ summary: 'Dislike a comment' })
  @ApiResponse({ status: 200, description: 'Comment disliked successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @Post(':id/dislike')
  async dislikeComment(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.dislikeComment(id);
  }

  // Reply endpoints
  @ApiOperation({ summary: 'Create reply to comment' })
  @ApiResponse({ status: 201, description: 'Reply created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/replies')
  async createReply(
    @Param('id', ParseIntPipe) commentId: number,
    @Body(ValidationPipe) replyData: Partial<CommentReply>,
    @Request() req,
  ): Promise<CommentReply> {
    return this.commentService.createReply(commentId, replyData, req.user.id);
  }

  @ApiOperation({ summary: 'Update reply' })
  @ApiResponse({ status: 200, description: 'Reply updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your reply' })
  @ApiResponse({ status: 404, description: 'Reply not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('replies/:id')
  async updateReply(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateData: Partial<CommentReply>,
    @Request() req,
  ): Promise<CommentReply> {
    return this.commentService.updateReply(id, updateData, req.user.id);
  }

  @ApiOperation({ summary: 'Delete reply' })
  @ApiResponse({ status: 200, description: 'Reply deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your reply' })
  @ApiResponse({ status: 404, description: 'Reply not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('replies/:id')
  async deleteReply(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    await this.commentService.deleteReply(id, req.user.id);
    return { message: 'Reply deleted successfully' };
  }

  @ApiOperation({ summary: 'Like a reply' })
  @ApiResponse({ status: 200, description: 'Reply liked successfully' })
  @ApiResponse({ status: 404, description: 'Reply not found' })
  @Post('replies/:id/like')
  async likeReply(@Param('id', ParseIntPipe) id: number): Promise<CommentReply> {
    return this.commentService.likeReply(id);
  }

  @ApiOperation({ summary: 'Dislike a reply' })
  @ApiResponse({ status: 200, description: 'Reply disliked successfully' })
  @ApiResponse({ status: 404, description: 'Reply not found' })
  @Post('replies/:id/dislike')
  async dislikeReply(@Param('id', ParseIntPipe) id: number): Promise<CommentReply> {
    return this.commentService.dislikeReply(id);
  }
}
