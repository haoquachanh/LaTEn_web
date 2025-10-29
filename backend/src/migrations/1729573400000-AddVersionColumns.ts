import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVersionColumns1729573400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const examinationsTable = await queryRunner.getTable('examinations');
    if (examinationsTable && !examinationsTable.findColumnByName('version')) {
      await queryRunner.addColumn(
        'examinations',
        new TableColumn({
          name: 'version',
          type: 'integer',
          default: 1,
          isNullable: false,
        }),
      );
    }

    const examinationQuestionsTable = await queryRunner.getTable('examination_questions');
    if (examinationQuestionsTable && !examinationQuestionsTable.findColumnByName('version')) {
      await queryRunner.addColumn(
        'examination_questions',
        new TableColumn({
          name: 'version',
          type: 'integer',
          default: 1,
          isNullable: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const examinationsTable = await queryRunner.getTable('examinations');
    if (examinationsTable && examinationsTable.findColumnByName('version')) {
      await queryRunner.dropColumn('examinations', 'version');
    }

    const examinationQuestionsTable = await queryRunner.getTable('examination_questions');
    if (examinationQuestionsTable && examinationQuestionsTable.findColumnByName('version')) {
      await queryRunner.dropColumn('examination_questions', 'version');
    }
  }
}
