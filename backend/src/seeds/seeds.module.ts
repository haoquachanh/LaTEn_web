import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from '../common/config/typeorm.config';
import { PostsSeedService } from './posts.seed';
import { QandASeed } from './qanda.seed';
import { Post } from '../entities/post.entity';
import { UserEntity } from '../entities/user.entity';
import { PostTag } from '../entities/post-tag.entity';
import { QandAQuestion } from '../entities/qanda-question.entity';
import { QandAAnswer } from '../entities/qanda-answer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    TypeOrmModule.forFeature([Post, UserEntity, PostTag, QandAQuestion, QandAAnswer]),
  ],
  providers: [PostsSeedService, QandASeed],
  exports: [PostsSeedService, QandASeed],
})
export class SeedsModule {}
