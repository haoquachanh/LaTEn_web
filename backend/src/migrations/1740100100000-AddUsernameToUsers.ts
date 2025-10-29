import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUsernameToUsers1740100100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    if (!table) {
      console.warn('Users table does not exist, skipping migration');
      return;
    }

    const hasUsername = table.columns.some((col) => col.name === 'username');
    if (!hasUsername) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'username',
          type: 'varchar',
          length: '255',
          isNullable: true,
          isUnique: false,
        }),
      );

      await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_USERS_USERNAME" ON users (username)`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_USERS_USERNAME"`);
    await queryRunner.dropColumn('users', 'username');
  }
}
