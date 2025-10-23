import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExaminationQuestionIndexes1729573300000 implements MigrationInterface {
  name = 'AddExaminationQuestionIndexes1729573300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add index on (examinationId, orderIndex) for ordering
    await queryRunner.query(`
      CREATE INDEX "IDX_examination_questions_examination_orderIndex" 
      ON "examination_questions" ("examinationId", "orderIndex")
    `);

    // Add index on (examinationId, isCorrect) for counting correct answers
    await queryRunner.query(`
      CREATE INDEX "IDX_examination_questions_examination_isCorrect" 
      ON "examination_questions" ("examinationId", "isCorrect")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_examination_questions_examination_isCorrect"`);
    await queryRunner.query(`DROP INDEX "IDX_examination_questions_examination_orderIndex"`);
  }
}
