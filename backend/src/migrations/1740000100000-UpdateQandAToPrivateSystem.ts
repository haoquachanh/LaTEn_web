import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateQandAToPrivateSystem1740000100000 implements MigrationInterface {
  name = 'UpdateQandAToPrivateSystem1740000100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove likes and views columns from qanda_questions
    await queryRunner.query(`ALTER TABLE "qanda_questions" DROP COLUMN "likes"`);
    await queryRunner.query(`ALTER TABLE "qanda_questions" DROP COLUMN "views"`);

    // Remove likes column from qanda_answers
    await queryRunner.query(`ALTER TABLE "qanda_answers" DROP COLUMN "likes"`);

    // Drop the like tables as they're no longer needed for private Q&A
    await queryRunner.query(`DROP TABLE "qanda_question_likes"`);
    await queryRunner.query(`DROP TABLE "qanda_answer_likes"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate likes columns
    await queryRunner.query(`ALTER TABLE "qanda_questions" ADD "likes" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "qanda_questions" ADD "views" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "qanda_answers" ADD "likes" integer NOT NULL DEFAULT '0'`);

    // Recreate like tables
    await queryRunner.query(`
      CREATE TABLE "qanda_question_likes" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "questionId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_qanda_question_likes" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "qanda_answer_likes" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "answerId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_qanda_answer_likes" PRIMARY KEY ("id")
      )
    `);

    // Recreate foreign keys
    await queryRunner.query(`
      ALTER TABLE "qanda_question_likes"
      ADD CONSTRAINT "FK_qanda_question_likes_user"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "qanda_question_likes"
      ADD CONSTRAINT "FK_qanda_question_likes_question"
      FOREIGN KEY ("questionId") REFERENCES "qanda_questions"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "qanda_answer_likes"
      ADD CONSTRAINT "FK_qanda_answer_likes_user"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "qanda_answer_likes"
      ADD CONSTRAINT "FK_qanda_answer_likes_answer"
      FOREIGN KEY ("answerId") REFERENCES "qanda_answers"("id") ON DELETE CASCADE
    `);
  }
}
