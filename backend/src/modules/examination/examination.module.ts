import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { Question } from '@entities/question.entity';
import { UserEntity } from '@entities/user.entity';
import { ExaminationTemplate } from '@entities/examination-template.entity';
import { ExaminationPreset } from '@entities/examination-preset.entity';
import { QuestionCategory } from '@entities/question-category.entity';

import { ExaminationService } from './examination.service';
import { ExaminationController } from './examination.controller';
import { ExaminationPresetService } from './examination-preset.service';
import { ExaminationPresetController } from './examination-preset.controller';
import { ExaminationAttemptModule } from '../examination-attempt/examination-attempt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Examination,
      ExaminationQuestion,
      ExaminationTemplate,
      ExaminationPreset,
      Question,
      UserEntity,
      QuestionCategory,
    ]),
    forwardRef(() => ExaminationAttemptModule), // Import with forwardRef to resolve circular dependency
  ],
  controllers: [ExaminationController, ExaminationPresetController],
  providers: [ExaminationService, ExaminationPresetService],
  exports: [ExaminationService, ExaminationPresetService],
})
export class ExaminationModule {}
