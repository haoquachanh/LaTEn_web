import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuestionsTable1642123456788 implements MigrationInterface {
  name = 'CreateQuestionsTable1642123456788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create questions table first
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "questions" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "type" character varying NOT NULL DEFAULT 'multiple_choice',
        "options" json,
        "correctAnswer" character varying NOT NULL,
        "explanation" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_questions" PRIMARY KEY ("id")
      )
    `);

    // Create users table if not exists
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'USER',
        "phone" character varying,
        "fullname" character varying,
        "birth" character varying,
        "created" TIMESTAMP NOT NULL DEFAULT now(),
        "updated" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "examinations" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "description" text,
        "duration" integer NOT NULL DEFAULT 60,
        "totalQuestions" integer NOT NULL DEFAULT 10,
        "passingScore" integer NOT NULL DEFAULT 70,
        "isPublished" boolean NOT NULL DEFAULT false,
        "createdBy" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_examinations" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "examination_results" (
        "id" SERIAL NOT NULL,
        "score" integer NOT NULL DEFAULT 0,
        "totalQuestions" integer NOT NULL DEFAULT 0,
        "correctAnswers" integer NOT NULL DEFAULT 0,
        "timeSpent" integer NOT NULL DEFAULT 0,
        "isPassed" boolean NOT NULL DEFAULT false,
        "startedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "completedAt" TIMESTAMP,
        "userId" integer NOT NULL,
        "examinationId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_examination_results" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "answers" (
        "id" SERIAL NOT NULL,
        "answer" character varying NOT NULL,
        "isCorrect" boolean NOT NULL DEFAULT false,
        "questionId" integer NOT NULL,
        "userId" integer,
        "examinationResultId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_answers" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" SERIAL NOT NULL,
        "content" text NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "userId" integer NOT NULL,
        "examinationId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comments" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "comment_replies" (
        "id" SERIAL NOT NULL,
        "content" text NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "userId" integer NOT NULL,
        "commentId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comment_replies" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comment_replies"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "answers"`);
    await queryRunner.query(`DROP TABLE "examination_results"`);
    await queryRunner.query(`DROP TABLE "examinations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "questions"`);
  }
}
