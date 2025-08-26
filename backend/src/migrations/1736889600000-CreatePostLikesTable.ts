import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePostLikesTable1736889600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post_likes',
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
            name: 'postId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'post_likes',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'post_likes',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'post_likes',
      new TableIndex({
        name: 'IDX_POST_LIKES_USER_POST',
        columnNames: ['userId', 'postId'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('post_likes');
    const foreignKeyUser = table.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    const foreignKeyPost = table.foreignKeys.find((fk) => fk.columnNames.indexOf('postId') !== -1);

    if (foreignKeyUser) {
      await queryRunner.dropForeignKey('post_likes', foreignKeyUser);
    }
    if (foreignKeyPost) {
      await queryRunner.dropForeignKey('post_likes', foreignKeyPost);
    }

    await queryRunner.dropTable('post_likes');
  }
}
