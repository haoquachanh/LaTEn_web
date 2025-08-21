import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdatePostTagDescriptionField1727575680512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Đảm bảo rằng cột description trong bảng post_tags có kiểu text thay vì varchar
    await queryRunner.changeColumn(
      'post_tags',
      'description',
      new TableColumn({
        name: 'description',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Khôi phục về kiểu varchar
    await queryRunner.changeColumn(
      'post_tags',
      'description',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
