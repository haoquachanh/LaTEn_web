import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSessionTrackingToExamination1729573200000 implements MigrationInterface {
  name = 'AddSessionTrackingToExamination1729573200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add sessionId column
    await queryRunner.addColumn(
      'examinations',
      new TableColumn({
        name: 'sessionId',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    // Add lastActivityAt column
    await queryRunner.addColumn(
      'examinations',
      new TableColumn({
        name: 'lastActivityAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Create index on sessionId for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_examinations_sessionId" ON "examinations" ("sessionId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX "IDX_examinations_sessionId"`);

    // Drop columns
    await queryRunner.dropColumn('examinations', 'lastActivityAt');
    await queryRunner.dropColumn('examinations', 'sessionId');
  }
}
