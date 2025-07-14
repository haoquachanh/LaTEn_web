import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaminationController } from './examination.controller';
import { ExaminationService } from './examination.service';
import { ExaminationEntity } from '@entities/examination.entity';
import { Question } from '@entities/question.entity';
import { Answer } from '@entities/answer.entity';
import { ExaminationResult } from '@entities/examination-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExaminationEntity, Question, Answer, ExaminationResult])],
  controllers: [ExaminationController],
  providers: [ExaminationService],
  exports: [ExaminationService],
})
export class ExaminationModule {}
