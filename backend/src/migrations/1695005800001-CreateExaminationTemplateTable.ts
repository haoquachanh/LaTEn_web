import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExaminationTemplateTable1695005800001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng examination_templates
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS examination_templates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50),
        content VARCHAR(50),
        level VARCHAR(50),
        "totalQuestions" INTEGER NOT NULL DEFAULT 0,
        "durationSeconds" INTEGER NOT NULL DEFAULT 3600,
        "questionFilters" JSONB,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdById" INTEGER REFERENCES users(id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Tạo bảng liên kết examination_template_categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS examination_template_categories (
        template_id INTEGER NOT NULL REFERENCES examination_templates(id) ON DELETE CASCADE,
        category_id INTEGER NOT NULL REFERENCES question_categories(id) ON DELETE CASCADE,
        PRIMARY KEY (template_id, category_id)
      );
    `);

    // Tạo index cho các trường thường xuyên tìm kiếm
    await queryRunner.query(`
      CREATE INDEX IDX_exam_template_active_type_level 
      ON examination_templates ("isActive", type, level);
      
      CREATE INDEX IDX_exam_template_created_at
      ON examination_templates ("createdAt");
      
      CREATE INDEX IDX_exam_template_title
      ON examination_templates (title);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS examination_template_categories;`);
    await queryRunner.query(`DROP TABLE IF EXISTS examination_templates;`);
  }
}
