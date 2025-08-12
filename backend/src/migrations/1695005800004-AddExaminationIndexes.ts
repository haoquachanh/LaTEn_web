import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExaminationIndexes1695005800004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm các index cho examination để tối ưu truy vấn
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS IDX_examination_status ON examinations (status);
      CREATE INDEX IF NOT EXISTS IDX_examination_created_at ON examinations (created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa các index khi rollback
    await queryRunner.query(`
      DROP INDEX IF EXISTS IDX_examination_status;
      DROP INDEX IF EXISTS IDX_examination_created_at;
    `);
  }
}
