import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { Question } from '@entities/question.entity';
import { UserEntity } from '@entities/user.entity';
import { ExaminationTemplate } from '@entities/examination-template.entity';

import { ExaminationService } from './examination.service';
import { ExaminationController } from './examination.controller';
import { ExaminationAttemptService } from '../examination-attempt/examination-attempt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Examination, ExaminationQuestion, ExaminationTemplate, Question, UserEntity])],
  controllers: [ExaminationController],
  providers: [ExaminationService, ExaminationAttemptService],
  exports: [ExaminationService, ExaminationAttemptService],
})
export class ExaminationModule {}
