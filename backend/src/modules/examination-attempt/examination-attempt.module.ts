import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationAttemptController } from './examination-attempt.controller';
import { ExaminationAttemptService } from './examination-attempt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Examination, ExaminationQuestion]),
  ],
  controllers: [ExaminationAttemptController],
  providers: [ExaminationAttemptService],
  exports: [ExaminationAttemptService],
})
export class ExaminationAttemptModule {}
