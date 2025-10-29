import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExaminationIndexes1695005800004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm các index cho examination để tối ưu truy vấn
    const table = await queryRunner.getTable('examinations');
    if (table) {
      const hasStatus = table.columns.some((col) => col.name === 'status');
      const hasCreatedAt = table.columns.some((col) => col.name === 'createdAt');

      if (hasStatus) {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_examination_status ON examinations (status);`);
      }

      if (hasCreatedAt) {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS IDX_examination_created_at ON examinations ("createdAt");`);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa các index khi rollback
    await queryRunner.query(`
      DROP INDEX IF EXISTS IDX_examination_status;
      DROP INDEX IF EXISTS IDX_examination_created_at;
    `);
  }
}
