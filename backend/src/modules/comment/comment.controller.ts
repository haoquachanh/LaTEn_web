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
import { Comment, CommentType } from '../../entities/comment.entity';
import { CommentReply } from '../../entities/comment-reply.entity';
import { CreateReplyDto } from './dtos/create-reply.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getAllComments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ comments: Comment[]; total: number }> {
    return this.commentService.getAllComments(page, limit);
  }

  @Get('entity/:entityType/:entityId')
  async getCommentsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ comments: Comment[]; total: number }> {
    return this.commentService.getCommentsByEntity(entityType, entityId, page, limit);
  }

  @Get('type/:type')
  async getCommentsByType(
    @Param('type') type: CommentType,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ comments: Comment[]; total: number }> {
    return this.commentService.getCommentsByType(type, page, limit);
  }

  @Get(':id')
  async getCommentById(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.getCommentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Body(ValidationPipe) commentData: Partial<Comment>, @Request() req): Promise<Comment> {
    return this.commentService.createComment(commentData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateData: Partial<Comment>,
    @Request() req,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, updateData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    await this.commentService.deleteComment(id, req.user.id);
    return { message: 'Comment deleted successfully' };
  }

  @Post(':id/like')
  async likeComment(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.likeComment(id);
  }

  @Post(':id/dislike')
  async dislikeComment(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.dislikeComment(id);
  }

  // Reply endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/replies')
  async createReply(
    @Param('id', ParseIntPipe) commentId: number,
    @Body(ValidationPipe) replyData: CreateReplyDto,
    @Request() req,
  ): Promise<CommentReply> {
    return this.commentService.createReply(commentId, replyData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('replies/:id')
  async updateReply(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateData: Partial<CommentReply>,
    @Request() req,
  ): Promise<CommentReply> {
    return this.commentService.updateReply(id, updateData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('replies/:id')
  async deleteReply(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    await this.commentService.deleteReply(id, req.user.id);
    return { message: 'Reply deleted successfully' };
  }

  @Post('replies/:id/like')
  async likeReply(@Param('id', ParseIntPipe) id: number): Promise<CommentReply> {
    return this.commentService.likeReply(id);
  }

  @Post('replies/:id/dislike')
  async dislikeReply(@Param('id', ParseIntPipe) id: number): Promise<CommentReply> {
    return this.commentService.dislikeReply(id);
  }
}
