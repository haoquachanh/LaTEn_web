import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Question } from '@entities/question.entity';
import { QuestionOption } from '@entities/question-option.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { QuestionBank } from '@entities/question-bank.entity';
import { HttpCacheInterceptor } from '@common/interceptors/cache.interceptor';
import { CacheService } from '@common/services/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionOption, QuestionCategory, QuestionBank])],
  controllers: [QuestionController],
  providers: [QuestionService, HttpCacheInterceptor, CacheService],
  exports: [QuestionService],
})
export class QuestionModule {}
