import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from '@entities/comment.entity';
import { CommentReply } from '@entities/comment-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentReply])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
