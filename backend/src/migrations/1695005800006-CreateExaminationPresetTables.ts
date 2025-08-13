import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExaminationPresetTables1695005800006 implements MigrationInterface {
  name = 'CreateExaminationPresetTables1695005800006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng examination_presets
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "examination_presets" (
        "id" SERIAL NOT NULL,
        "title" character varying(255) NOT NULL,
        "description" text,
        "type" character varying(50),
        "content" character varying(50),
        "level" character varying(50),
        "totalQuestions" integer NOT NULL,
        "durationSeconds" integer NOT NULL,
        "config" jsonb,
        "isActive" boolean NOT NULL DEFAULT true,
        "isPublic" boolean NOT NULL DEFAULT false,
        "createdById" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_examination_presets" PRIMARY KEY ("id")
      )
    `);

    // Tạo bảng nhiều-nhiều examination_preset_questions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "examination_preset_questions" (
        "presetId" integer NOT NULL,
        "questionId" integer NOT NULL,
        CONSTRAINT "PK_examination_preset_questions" PRIMARY KEY ("presetId", "questionId")
      )
    `);

    // Tạo bảng nhiều-nhiều examination_preset_categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "examination_preset_categories" (
        "presetId" integer NOT NULL,
        "categoryId" integer NOT NULL,
        CONSTRAINT "PK_examination_preset_categories" PRIMARY KEY ("presetId", "categoryId")
      )
    `);

    // Tạo các khóa ngoại cho bảng examination_preset_questions
    await queryRunner.query(`
      ALTER TABLE "examination_preset_questions" 
      ADD CONSTRAINT "FK_preset_questions_preset" 
      FOREIGN KEY ("presetId") REFERENCES "examination_presets"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "examination_preset_questions" 
      ADD CONSTRAINT "FK_preset_questions_question" 
      FOREIGN KEY ("questionId") REFERENCES "questions"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    // Tạo các khóa ngoại cho bảng examination_preset_categories
    await queryRunner.query(`
      ALTER TABLE "examination_preset_categories" 
      ADD CONSTRAINT "FK_preset_categories_preset" 
      FOREIGN KEY ("presetId") REFERENCES "examination_presets"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "examination_preset_categories" 
      ADD CONSTRAINT "FK_preset_categories_category" 
      FOREIGN KEY ("categoryId") REFERENCES "question_categories"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    // Tạo khóa ngoại cho createdById
    await queryRunner.query(`
      ALTER TABLE "examination_presets" 
      ADD CONSTRAINT "FK_examination_presets_user" 
      FOREIGN KEY ("createdById") REFERENCES "users"("id") 
      ON DELETE SET NULL ON UPDATE CASCADE
    `);

    // Tạo các chỉ mục
    await queryRunner.query(`
      CREATE INDEX "IDX_examination_presets_active_level" ON "examination_presets" ("isActive", "level")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_examination_presets_created_at" ON "examination_presets" ("created_at")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_examination_presets_title" ON "examination_presets" ("title")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa các khóa ngoại
    await queryRunner.query(`
      ALTER TABLE "examination_presets" DROP CONSTRAINT IF EXISTS "FK_examination_presets_user"
    `);

    await queryRunner.query(`
      ALTER TABLE "examination_preset_categories" DROP CONSTRAINT IF EXISTS "FK_preset_categories_category"
    `);

    await queryRunner.query(`
      ALTER TABLE "examination_preset_categories" DROP CONSTRAINT IF EXISTS "FK_preset_categories_preset"
    `);

    await queryRunner.query(`
      ALTER TABLE "examination_preset_questions" DROP CONSTRAINT IF EXISTS "FK_preset_questions_question"
    `);

    await queryRunner.query(`
      ALTER TABLE "examination_preset_questions" DROP CONSTRAINT IF EXISTS "FK_preset_questions_preset"
    `);

    // Xóa các chỉ mục
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_examination_presets_title"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_examination_presets_created_at"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_examination_presets_active_level"
    `);

    // Xóa các bảng
    await queryRunner.query(`
      DROP TABLE IF EXISTS "examination_preset_categories"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "examination_preset_questions"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "examination_presets"
    `);
  }
}
