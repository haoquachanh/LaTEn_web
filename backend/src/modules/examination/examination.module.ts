import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationController } from './examination.controller';
import { ExaminationService } from './examination.service';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { ExaminationEntity } from '@entities/examination.entity';
import { Question } from '@entities/question.entity';
import { Answer } from '@entities/answer.entity';
import { ExaminationResult } from '@entities/examination-result.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { QuestionBank } from '@entities/question-bank.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExaminationEntity, Question, Answer, ExaminationResult, QuestionCategory, QuestionBank]),
  ],
  controllers: [ExaminationController, QuestionController],
  providers: [ExaminationService, QuestionService],
  exports: [ExaminationService, QuestionService],
})
export class ExaminationModule {}
