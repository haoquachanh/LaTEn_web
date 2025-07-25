import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuestionCategoriesAndBanks1642123456789 implements MigrationInterface {
  name = 'CreateQuestionCategoriesAndBanks1642123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create question_categories table
    await queryRunner.query(`
      CREATE TABLE "question_categories" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_question_categories" PRIMARY KEY ("id")
      )
    `);

    // Create question_banks table
    await queryRunner.query(`
      CREATE TABLE "question_banks" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "isPublic" boolean NOT NULL DEFAULT true,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdBy" integer NOT NULL,
        "categoryId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_question_banks" PRIMARY KEY ("id")
      )
    `);

    // Add new columns to questions table
    await queryRunner.query(`
      ALTER TABLE "questions" 
      ADD COLUMN "format" character varying NOT NULL DEFAULT 'reading',
      ADD COLUMN "difficulty" integer NOT NULL DEFAULT 1,
      ADD COLUMN "acceptableAnswers" json,
      ADD COLUMN "passage" text,
      ADD COLUMN "timeLimit" integer,
      ADD COLUMN "metadata" json,
      ADD COLUMN "categoryId" integer,
      ADD COLUMN "questionBankId" integer
    `);

    // Create foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "question_banks" 
      ADD CONSTRAINT "FK_question_banks_users" 
      FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "question_banks" 
      ADD CONSTRAINT "FK_question_banks_categories" 
      FOREIGN KEY ("categoryId") REFERENCES "question_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "questions" 
      ADD CONSTRAINT "FK_questions_categories" 
      FOREIGN KEY ("categoryId") REFERENCES "question_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "questions" 
      ADD CONSTRAINT "FK_questions_banks" 
      FOREIGN KEY ("questionBankId") REFERENCES "question_banks"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_questions_type" ON "questions" ("type")`);
    await queryRunner.query(`CREATE INDEX "IDX_questions_format" ON "questions" ("format")`);
    await queryRunner.query(`CREATE INDEX "IDX_questions_difficulty" ON "questions" ("difficulty")`);
    await queryRunner.query(`CREATE INDEX "IDX_question_banks_public" ON "question_banks" ("isPublic")`);
    await queryRunner.query(`CREATE INDEX "IDX_question_categories_active" ON "question_categories" ("isActive")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_question_categories_active"`);
    await queryRunner.query(`DROP INDEX "IDX_question_banks_public"`);
    await queryRunner.query(`DROP INDEX "IDX_questions_difficulty"`);
    await queryRunner.query(`DROP INDEX "IDX_questions_format"`);
    await queryRunner.query(`DROP INDEX "IDX_questions_type"`);

    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_questions_banks"`);
    await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_questions_categories"`);
    await queryRunner.query(`ALTER TABLE "question_banks" DROP CONSTRAINT "FK_question_banks_categories"`);
    await queryRunner.query(`ALTER TABLE "question_banks" DROP CONSTRAINT "FK_question_banks_users"`);

    // Remove new columns from questions table
    await queryRunner.query(`
      ALTER TABLE "questions" 
      DROP COLUMN "questionBankId",
      DROP COLUMN "categoryId",
      DROP COLUMN "metadata",
      DROP COLUMN "timeLimit",
      DROP COLUMN "passage",
      DROP COLUMN "acceptableAnswers",
      DROP COLUMN "difficulty",
      DROP COLUMN "format"
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE "question_banks"`);
    await queryRunner.query(`DROP TABLE "question_categories"`);
  }
}
