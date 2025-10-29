import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExaminationQuestionIndexes1729573300000 implements MigrationInterface {
  name = 'AddExaminationQuestionIndexes1729573300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_name = 'examination_questions'
        ) THEN
          CREATE INDEX IF NOT EXISTS "IDX_examination_questions_examination_orderIndex" 
          ON "examination_questions" ("examinationId", "orderIndex");
          
          CREATE INDEX IF NOT EXISTS "IDX_examination_questions_examination_isCorrect" 
          ON "examination_questions" ("examinationId", "isCorrect");
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_examination_questions_examination_isCorrect"`);
    await queryRunner.query(`DROP INDEX "IDX_examination_questions_examination_orderIndex"`);
  }
}
