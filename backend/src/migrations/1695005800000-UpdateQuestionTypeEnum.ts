import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQuestionTypeEnum1695005800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type_enum') THEN
          ALTER TABLE "questions" ALTER COLUMN "type" DROP DEFAULT;
          
          CREATE TYPE "public"."question_type_enum" AS ENUM(
            'true_false', 
            'multiple_choice', 
            'single_choice', 
            'short_answer', 
            'essay', 
            'matching', 
            'fill_in_blank', 
            'ordering'
          );
          
          ALTER TABLE "questions" 
            ALTER COLUMN "type" TYPE "question_type_enum" 
            USING "type"::text::"question_type_enum";
          
          ALTER TABLE "questions" 
            ALTER COLUMN "type" SET DEFAULT 'multiple_choice'::question_type_enum;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type_enum') THEN
          ALTER TABLE "questions" ALTER COLUMN "type" TYPE VARCHAR;
          DROP TYPE "public"."question_type_enum";
        END IF;
      END $$;
    `);
  }
}
