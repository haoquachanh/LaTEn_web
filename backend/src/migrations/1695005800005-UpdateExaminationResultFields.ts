import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExaminationResultFields1695005800005 implements MigrationInterface {
  name = 'UpdateExaminationResultFields1695005800005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = 'examination_questions'
        ) THEN
          ALTER TABLE "examination_questions"
          ADD COLUMN IF NOT EXISTS "score" float NOT NULL DEFAULT 0;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "examinations"
      ADD COLUMN IF NOT EXISTS "templateId" integer
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'FK_examinations_templates'
        ) THEN
          ALTER TABLE "examinations"
          ADD CONSTRAINT "FK_examinations_templates"
          FOREIGN KEY ("templateId") REFERENCES "examination_templates"("id")
          ON DELETE SET NULL;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      UPDATE "examination_templates"
      SET config = jsonb_set(
        COALESCE(config, '{}'),
        '{resultDisplay}',
        '{"showImmediately": true, "showCorrectAnswers": true, "showExplanation": true, "showScoreBreakdown": true}'
      )
      WHERE config IS NULL OR config->>'resultDisplay' IS NULL
    `);

    await queryRunner.query(`
      UPDATE "examination_templates"
      SET config = jsonb_set(
        COALESCE(config, '{}'),
        '{security}',
        '{"preventCopy": false, "preventTabSwitch": false, "timeoutWarning": 5, "shuffleOptions": false}'
      )
      WHERE config IS NULL OR config->>'security' IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "examinations"
      DROP CONSTRAINT IF EXISTS "FK_examinations_templates"
    `);

    await queryRunner.query(`
      ALTER TABLE "examinations"
      DROP COLUMN IF EXISTS "templateId"
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = 'examination_questions'
        ) THEN
          ALTER TABLE "examination_questions"
          DROP COLUMN IF EXISTS "score";
        END IF;
      END $$;
    `);
  }
}
