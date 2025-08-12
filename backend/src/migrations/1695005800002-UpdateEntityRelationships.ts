import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntityRelationships1695005800002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cập nhật các bảng để phù hợp với các thay đổi entity

    // 1. Thêm trường cấu hình vào ExaminationTemplate
    await queryRunner.query(`
      ALTER TABLE examination_templates
      ADD COLUMN config JSONB;
    `);

    // 2. Thêm trường questionIds vào ExaminationTemplate (có thể được định nghĩa trong config)
    await queryRunner.query(`
      ALTER TABLE examination_templates
      ADD COLUMN question_ids INTEGER[];
    `);

    // 3. Cập nhật examination.entity nếu cần
    await queryRunner.query(`
      ALTER TABLE examinations
      ADD COLUMN IF NOT EXISTS incorrect_answers INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS skipped_questions INTEGER DEFAULT 0;
    `);

    // 4. Thêm trường feedback vào examination_questions
    await queryRunner.query(`
      ALTER TABLE examination_questions
      ADD COLUMN IF NOT EXISTS feedback TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE examination_templates
      DROP COLUMN IF EXISTS config,
      DROP COLUMN IF EXISTS question_ids;
    `);

    await queryRunner.query(`
      ALTER TABLE examinations
      DROP COLUMN IF EXISTS incorrect_answers,
      DROP COLUMN IF EXISTS skipped_questions;
    `);

    await queryRunner.query(`
      ALTER TABLE examination_questions
      DROP COLUMN IF EXISTS feedback;
    `);
  }
}
