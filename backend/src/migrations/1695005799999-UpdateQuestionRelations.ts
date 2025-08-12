import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQuestionRelations1695005799999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Xóa foreign key cũ từ questions đến categories
    await queryRunner.query(`
      ALTER TABLE questions DROP CONSTRAINT IF EXISTS "FK_question_category";
    `);

    // Thêm các trường mới vào questions
    await queryRunner.query(`
      ALTER TABLE questions 
      ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);

    // Tạo bảng trung gian cho quan hệ many-to-many giữa questions và categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS question_categories_relations (
        "questionId" INTEGER NOT NULL,
        "categoryId" INTEGER NOT NULL,
        PRIMARY KEY ("questionId", "categoryId"),
        CONSTRAINT "FK_question_categories_relations_question" 
          FOREIGN KEY ("questionId") REFERENCES questions (id) ON DELETE CASCADE,
        CONSTRAINT "FK_question_categories_relations_category" 
          FOREIGN KEY ("categoryId") REFERENCES question_categories (id) ON DELETE CASCADE
      );
    `);

    // Thêm indexes cho questions
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_questions_type_difficulty" ON questions (type, difficulty_level);
      CREATE INDEX IF NOT EXISTS "IDX_questions_created_at" ON questions (created_at);
      CREATE INDEX IF NOT EXISTS "IDX_questions_mode" ON questions (mode);
    `);

    // Thêm các trường mới vào question_categories
    await queryRunner.query(`
      ALTER TABLE question_categories 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS parent_id INTEGER;
    `);

    // Thêm index cho question_categories
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_question_categories_name" ON question_categories (name);
    `);

    // Sao chép dữ liệu từ mối quan hệ cũ sang mối quan hệ mới
    await queryRunner.query(`
      INSERT INTO question_categories_relations ("questionId", "categoryId")
      SELECT q.id, q.category_id FROM questions q
      WHERE q.category_id IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_questions_type_difficulty";
      DROP INDEX IF EXISTS "IDX_questions_created_at";
      DROP INDEX IF EXISTS "IDX_questions_mode";
      DROP INDEX IF EXISTS "IDX_question_categories_name";
    `);

    // Xóa bảng trung gian
    await queryRunner.query(`
      DROP TABLE IF EXISTS question_categories_relations;
    `);

    // Xóa các trường mới từ questions
    await queryRunner.query(`
      ALTER TABLE questions 
      DROP COLUMN IF EXISTS points,
      DROP COLUMN IF EXISTS is_active;
    `);

    // Xóa các trường mới từ question_categories
    await queryRunner.query(`
      ALTER TABLE question_categories 
      DROP COLUMN IF EXISTS is_active,
      DROP COLUMN IF EXISTS parent_id;
    `);

    // Khôi phục foreign key cũ
    await queryRunner.query(`
      ALTER TABLE questions 
      ADD CONSTRAINT "FK_question_category" 
      FOREIGN KEY ("categoryId") REFERENCES question_categories (id);
    `);
  }
}
