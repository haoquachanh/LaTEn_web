import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntityRelationships1695005800002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE examination_templates
      ADD COLUMN IF NOT EXISTS config JSONB;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'examination_templates' 
          AND column_name = 'question_filters'
        ) THEN
          UPDATE examination_templates
          SET config = COALESCE(config, '{}'::jsonb) || 
                     jsonb_build_object('questionFilters', question_filters)
          WHERE question_filters IS NOT NULL;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE examination_templates
      ADD COLUMN IF NOT EXISTS question_ids INTEGER[];
    `);

    await queryRunner.query(`
      ALTER TABLE examinations
      ADD COLUMN IF NOT EXISTS incorrect_answers INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS skipped_questions INTEGER DEFAULT 0;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = 'examination_questions'
        ) THEN
          ALTER TABLE examination_questions
          ADD COLUMN IF NOT EXISTS feedback TEXT,
          ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Phục hồi question_filters từ config (nếu có)
      UPDATE examination_templates 
      SET question_filters = config->'questionFilters'
      WHERE config IS NOT NULL AND config ? 'questionFilters';
      
      -- Xóa các trường không cần thiết
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
