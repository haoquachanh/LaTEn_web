import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QandAQuestion } from '../../entities/qanda-question.entity';
import { QandAAnswer } from '../../entities/qanda-answer.entity';
import { PostTag } from '../../entities/post-tag.entity';
import { UserEntity } from '../../entities/user.entity';
import { QandAController } from './qanda.controller';
import { QandAService } from './qanda.service';

@Module({
  imports: [TypeOrmModule.forFeature([QandAQuestion, QandAAnswer, PostTag, UserEntity])],
  controllers: [QandAController],
  providers: [QandAService],
  exports: [QandAService],
})
export class QandAModule {}
