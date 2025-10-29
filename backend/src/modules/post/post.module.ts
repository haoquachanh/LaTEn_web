import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@entities/post.entity';
import { PostTag } from '@entities/post-tag.entity';
import { PostLike } from '@entities/post-like.entity';
import { UserEntity } from '@entities/user.entity';
import { Comment } from '@entities/comment.entity';
import { CommentReply } from '@entities/comment-reply.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { HttpCacheInterceptor } from '@common/interceptors/cache.interceptor';
import { CacheService } from '@common/services/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostTag, PostLike, UserEntity, Comment, CommentReply])],
  controllers: [PostController],
  providers: [PostService, HttpCacheInterceptor, CacheService],
  exports: [PostService],
})
export class PostModule {}
