import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQuestionBankCategories1695005800003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng trung gian cho quan hệ many-to-many giữa banks và categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS question_bank_categories (
        bank_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (bank_id, category_id),
        CONSTRAINT FK_question_bank_category_bank 
          FOREIGN KEY (bank_id) REFERENCES question_banks (id) ON DELETE CASCADE,
        CONSTRAINT FK_question_bank_category_category 
          FOREIGN KEY (category_id) REFERENCES question_categories (id) ON DELETE CASCADE
      );
    `);

    // Sao chép dữ liệu từ quan hệ one-to-many cũ vào quan hệ many-to-many mới
    await queryRunner.query(`
      INSERT INTO question_bank_categories (bank_id, category_id)
      SELECT id, category_id FROM question_banks
      WHERE category_id IS NOT NULL
      ON CONFLICT DO NOTHING;
    `);

    // Tạo thêm index cho question_banks để hỗ trợ tìm kiếm
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS IDX_question_banks_name ON question_banks (name);
      CREATE INDEX IF NOT EXISTS IDX_question_banks_is_public ON question_banks (is_public);
      CREATE INDEX IF NOT EXISTS IDX_question_banks_is_active ON question_banks (is_active);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa index
    await queryRunner.query(`
      DROP INDEX IF EXISTS IDX_question_banks_name;
      DROP INDEX IF EXISTS IDX_question_banks_is_public;
      DROP INDEX IF EXISTS IDX_question_banks_is_active;
    `);

    // Xóa bảng trung gian
    await queryRunner.query(`
      DROP TABLE IF EXISTS question_bank_categories;
    `);
  }
}
