import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Question } from '@entities/question.entity';
import { QuestionOption } from '@entities/question-option.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { QuestionBank } from '@entities/question-bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionOption, QuestionCategory, QuestionBank])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
