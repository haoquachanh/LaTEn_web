import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUserScoresTable1716039708591 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_scores',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'score',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'examCount',
            type: 'int',
            default: 0,
          },
          {
            name: 'totalCorrectAnswers',
            type: 'int',
            default: 0,
          },
          {
            name: 'totalQuestions',
            type: 'int',
            default: 0,
          },
          {
            name: 'timeFrame',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'yearMonth',
            type: 'varchar',
            length: '7',
            isNullable: true,
          },
          {
            name: 'yearWeek',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'user_scores',
      new TableIndex({
        name: 'IDX_user_scores_userId',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'user_scores',
      new TableIndex({
        name: 'IDX_user_scores_timeFrame',
        columnNames: ['timeFrame'],
      }),
    );

    await queryRunner.createIndex(
      'user_scores',
      new TableIndex({
        name: 'IDX_user_scores_yearMonth',
        columnNames: ['yearMonth'],
      }),
    );

    await queryRunner.createIndex(
      'user_scores',
      new TableIndex({
        name: 'IDX_user_scores_yearWeek',
        columnNames: ['yearWeek'],
      }),
    );

    await queryRunner.createIndex(
      'user_scores',
      new TableIndex({
        name: 'IDX_user_scores_date',
        columnNames: ['date'],
      }),
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'user_scores',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_scores');

    // Drop foreign key
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('user_scores', foreignKey);
    }

    // Drop indexes
    await queryRunner.dropIndex('user_scores', 'IDX_user_scores_userId');
    await queryRunner.dropIndex('user_scores', 'IDX_user_scores_timeFrame');
    await queryRunner.dropIndex('user_scores', 'IDX_user_scores_yearMonth');
    await queryRunner.dropIndex('user_scores', 'IDX_user_scores_yearWeek');
    await queryRunner.dropIndex('user_scores', 'IDX_user_scores_date');

    // Drop table
    await queryRunner.dropTable('user_scores');
  }
}
