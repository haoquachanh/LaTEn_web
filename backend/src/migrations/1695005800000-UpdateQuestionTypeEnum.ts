import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQuestionTypeEnum1695005800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cập nhật enum type để thêm các loại câu hỏi mới
    await queryRunner.query(`
      ALTER TYPE "public"."question_type_enum" RENAME TO "question_type_enum_old";
      CREATE TYPE "public"."question_type_enum" AS ENUM('true_false', 'multiple_choice', 'single_choice', 'short_answer', 'essay', 'matching', 'fill_in_blank', 'ordering');
      
      -- Cập nhật cột sử dụng enum mới
      ALTER TABLE "questions" 
        ALTER COLUMN "type" TYPE "question_type_enum" 
        USING "type"::text::"question_type_enum";
      
      -- Xóa enum cũ
      DROP TYPE "public"."question_type_enum_old";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Khôi phục enum cũ
    await queryRunner.query(`
      ALTER TYPE "public"."question_type_enum" RENAME TO "question_type_enum_temp";
      CREATE TYPE "public"."question_type_enum" AS ENUM('true_false', 'multiple_choice', 'short_answer', 'essay');
      
      -- Cập nhật cột về enum cũ, chuyển đổi các giá trị mới sang multiple_choice
      ALTER TABLE "questions" 
        ALTER COLUMN "type" TYPE "question_type_enum" 
        USING (
          CASE 
            WHEN "type"::text = 'single_choice' THEN 'multiple_choice'::text
            WHEN "type"::text = 'matching' THEN 'multiple_choice'::text
            WHEN "type"::text = 'fill_in_blank' THEN 'short_answer'::text
            WHEN "type"::text = 'ordering' THEN 'multiple_choice'::text
            ELSE "type"::text
          END
        )::"question_type_enum";
      
      -- Xóa enum tạm thời
      DROP TYPE "public"."question_type_enum_temp";
    `);
  }
}
