import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusAndFeedbackToExamination1693990000000 implements MigrationInterface {
  name = 'AddStatusAndFeedbackToExamination1693990000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm column status nếu chưa tồn tại
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='examinations' AND column_name='status'
        ) THEN
          ALTER TABLE "examinations" 
          ADD COLUMN "status" varchar DEFAULT 'created' NOT NULL;
        END IF;
      END $$;
    `);

    // Thêm column feedback nếu chưa tồn tại
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='examinations' AND column_name='feedback'
        ) THEN
          ALTER TABLE "examinations" 
          ADD COLUMN "feedback" text;
        END IF;
      END $$;
    `);

    // Cập nhật dữ liệu cũ (với check column tồn tại trước)
    const tableExists = await queryRunner.hasTable('examinations');
    if (tableExists) {
      const table = await queryRunner.getTable('examinations');
      const hasCompletedAt = table?.columns.some((col) => col.name === 'completedAt');
      const hasStartedAt = table?.columns.some((col) => col.name === 'startedAt');

      if (hasCompletedAt) {
        await queryRunner.query(`
          UPDATE "examinations" 
          SET "status" = 'completed' 
          WHERE "completedAt" IS NOT NULL AND "status" = 'created'
        `);
      }

      if (hasStartedAt && hasCompletedAt) {
        await queryRunner.query(`
          UPDATE "examinations" 
          SET "status" = 'in_progress' 
          WHERE "completedAt" IS NULL AND "startedAt" IS NOT NULL AND "status" = 'created'
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "examinations" DROP COLUMN "feedback"`);
    await queryRunner.query(`ALTER TABLE "examinations" DROP COLUMN "status"`);
  }
}
