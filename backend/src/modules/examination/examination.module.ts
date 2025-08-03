import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationController } from './examination.controller';
import { ExaminationService } from './examination.service';
import { Examination } from '@entities/examination.entity';
import { Question } from '@entities/question.entity';
import { QuestionOption } from '@entities/question-option.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationAnswer } from '@entities/examination-answer.entity';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Examination, Question, QuestionOption, ExaminationQuestion, ExaminationAnswer]),
    QuestionModule,
  ],
  controllers: [ExaminationController],
  providers: [ExaminationService],
  exports: [ExaminationService],
})
export class ExaminationModule {}
