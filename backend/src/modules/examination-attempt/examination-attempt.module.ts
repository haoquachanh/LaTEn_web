import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationTemplate } from '@entities/examination-template.entity';
import { Question } from '@entities/question.entity';
import { ExaminationAttemptController } from './examination-attempt.controller';
import { ExaminationAttemptService } from './examination-attempt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Examination, ExaminationQuestion, ExaminationTemplate, Question])],
  controllers: [ExaminationAttemptController],
  providers: [ExaminationAttemptService],
  exports: [ExaminationAttemptService],
})
export class ExaminationAttemptModule {}
