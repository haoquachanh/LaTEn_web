import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusAndFeedbackToExamination1693990000000 implements MigrationInterface {
  name = 'AddStatusAndFeedbackToExamination1693990000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "examinations" 
      ADD COLUMN "status" varchar DEFAULT 'created' NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "examinations" 
      ADD COLUMN "feedback" text
    `);

    // Cập nhật dữ liệu cũ
    await queryRunner.query(`
      UPDATE "examinations" 
      SET "status" = 'completed' 
      WHERE "completedAt" IS NOT NULL
    `);

    await queryRunner.query(`
      UPDATE "examinations" 
      SET "status" = 'in_progress' 
      WHERE "completedAt" IS NULL AND "startedAt" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "examinations" DROP COLUMN "feedback"`);
    await queryRunner.query(`ALTER TABLE "examinations" DROP COLUMN "status"`);
  }
}
