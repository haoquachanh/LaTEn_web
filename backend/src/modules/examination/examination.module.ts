import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { Question } from '@entities/question.entity';
import { UserEntity } from '@entities/user.entity';

import { ExaminationService } from './examination.service';
import { ExaminationController } from './examination.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Examination, ExaminationQuestion, Question, UserEntity])],
  controllers: [ExaminationController],
  providers: [ExaminationService],
  exports: [ExaminationService],
})
export class ExaminationModule {}
