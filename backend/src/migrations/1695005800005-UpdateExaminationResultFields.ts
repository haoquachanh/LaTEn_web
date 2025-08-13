import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExaminationResultFields1695005800005 implements MigrationInterface {
  name = 'UpdateExaminationResultFields1695005800005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm trường score vào bảng examination_questions
    await queryRunner.query(`
      ALTER TABLE "examination_questions"
      ADD COLUMN IF NOT EXISTS "score" float NOT NULL DEFAULT 0
    `);

    // Thêm trường templateId vào bảng examinations
    await queryRunner.query(`
      ALTER TABLE "examinations"
      ADD COLUMN IF NOT EXISTS "templateId" integer
    `);

    // Tạo khóa ngoại cho templateId
    await queryRunner.query(`
      ALTER TABLE "examinations"
      ADD CONSTRAINT "FK_examinations_templates"
      FOREIGN KEY ("templateId") REFERENCES "examination_templates"("id")
      ON DELETE SET NULL
    `);

    // Cập nhật cấu trúc config trong bảng examination_templates
    await queryRunner.query(`
      UPDATE "examination_templates"
      SET config = jsonb_set(
        COALESCE(config, '{}'),
        '{resultDisplay}',
        '{"showImmediately": true, "showCorrectAnswers": true, "showExplanation": true, "showScoreBreakdown": true}'
      )
      WHERE config IS NULL OR config->>'resultDisplay' IS NULL
    `);

    // Cập nhật cấu trúc config để thêm cấu hình security
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
    // Xóa khóa ngoại templateId
    await queryRunner.query(`
      ALTER TABLE "examinations"
      DROP CONSTRAINT IF EXISTS "FK_examinations_templates"
    `);

    // Xóa trường templateId
    await queryRunner.query(`
      ALTER TABLE "examinations"
      DROP COLUMN IF EXISTS "templateId"
    `);

    // Xóa trường score
    await queryRunner.query(`
      ALTER TABLE "examination_questions"
      DROP COLUMN IF EXISTS "score"
    `);
  }
}
