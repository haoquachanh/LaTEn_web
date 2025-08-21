import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePostsAndTagsTables1727557887599 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create post_tags table
    await queryRunner.createTable(
      new Table({
        name: 'post_tags',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create posts table
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'fullContent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'imageUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['regular', 'question'],
            default: "'regular'",
          },
          {
            name: 'likes',
            type: 'int',
            default: 0,
          },
          {
            name: 'views',
            type: 'int',
            default: 0,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create post_tags_relation table for many-to-many relationship
    await queryRunner.createTable(
      new Table({
        name: 'post_tags_relation',
        columns: [
          {
            name: 'postId',
            type: 'int',
          },
          {
            name: 'tagId',
            type: 'int',
          },
        ],
      }),
      true,
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'post_tags_relation',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'post_tags_relation',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'post_tags',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes for better performance
    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        name: 'IDX_POSTS_USER',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        name: 'IDX_POSTS_TYPE',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'posts',
      new TableIndex({
        name: 'IDX_POSTS_CREATED_AT',
        columnNames: ['createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'post_tags_relation',
      new TableIndex({
        name: 'IDX_POST_TAGS_POST_ID',
        columnNames: ['postId'],
      }),
    );

    await queryRunner.createIndex(
      'post_tags_relation',
      new TableIndex({
        name: 'IDX_POST_TAGS_TAG_ID',
        columnNames: ['tagId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.dropTable('post_tags_relation');
    await queryRunner.dropTable('posts');
    await queryRunner.dropTable('post_tags');
  }
}
