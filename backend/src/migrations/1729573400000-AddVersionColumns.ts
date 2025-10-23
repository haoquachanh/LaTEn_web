import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVersionColumns1729573400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add version column to examinations table
    await queryRunner.addColumn(
      'examinations',
      new TableColumn({
        name: 'version',
        type: 'integer',
        default: 1,
        isNullable: false,
      }),
    );

    // Add version column to examination_questions table
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('examinations', 'version');
    await queryRunner.dropColumn('examination_questions', 'version');
  }
}
