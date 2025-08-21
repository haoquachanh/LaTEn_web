import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsSeedService } from './posts.seed';
import { Post } from '../entities/post.entity';
import { UserEntity } from '../entities/user.entity';
import { PostTag } from '../entities/post-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, UserEntity, PostTag])],
  providers: [PostsSeedService],
  exports: [PostsSeedService],
})
export class SeedsModule {}
