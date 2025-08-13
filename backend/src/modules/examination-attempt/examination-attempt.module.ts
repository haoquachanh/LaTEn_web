import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationTemplate } from '@entities/examination-template.entity';
import { ExaminationPreset } from '@entities/examination-preset.entity';
import { Question } from '@entities/question.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { UserEntity } from '@entities/user.entity';
import { ExaminationAttemptController } from './examination-attempt.controller';
import { ExaminationAttemptService } from './examination-attempt.service';
import { ExaminationModule } from '../examination/examination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Examination,
      ExaminationQuestion,
      ExaminationTemplate,
      ExaminationPreset,
      Question,
      QuestionCategory,
      UserEntity,
    ]),
    // Use forwardRef to resolve circular dependency
    forwardRef(() => ExaminationModule),
  ],
  controllers: [ExaminationAttemptController],
  providers: [ExaminationAttemptService],
  exports: [ExaminationAttemptService],
})
export class ExaminationAttemptModule {}
