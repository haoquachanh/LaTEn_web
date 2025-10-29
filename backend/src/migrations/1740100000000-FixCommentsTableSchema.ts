import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FixCommentsTableSchema1740100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('comments');
    if (!table) {
      console.warn('Comments table does not exist, skipping migration');
      return;
    }

    const hasExaminationId = table.columns.some((col) => col.name === 'examinationId');
    const hasType = table.columns.some((col) => col.name === 'type');
    const hasTargetId = table.columns.some((col) => col.name === 'targetId');

    if (hasExaminationId && !hasType && !hasTargetId) {
      await queryRunner.addColumn(
        'comments',
        new TableColumn({
          name: 'type',
          type: 'enum',
          enum: ['post', 'question', 'exam'],
          default: "'exam'",
        }),
      );

      await queryRunner.addColumn(
        'comments',
        new TableColumn({
          name: 'targetId',
          type: 'int',
          isNullable: true,
        }),
      );

      await queryRunner.query(`
        UPDATE comments SET "targetId" = "examinationId", type = 'exam' WHERE "examinationId" IS NOT NULL
      `);

      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS "IDX_COMMENTS_TYPE_TARGET" ON comments (type, "targetId")
      `);
    }

    const hasAuthorId = table.columns.some((col) => col.name === 'authorId');
    if (!hasAuthorId) {
      await queryRunner.addColumn(
        'comments',
        new TableColumn({
          name: 'authorId',
          type: 'int',
          isNullable: true,
        }),
      );

      await queryRunner.query(`UPDATE comments SET "authorId" = "userId" WHERE "authorId" IS NULL`);

      await queryRunner.query(`
        DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'FK_comments_author'
          ) THEN
            ALTER TABLE comments 
            ADD CONSTRAINT "FK_comments_author" 
            FOREIGN KEY ("authorId") REFERENCES users(id) ON DELETE CASCADE;
          END IF;
        END $$;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_COMMENTS_TYPE_TARGET"`);
    await queryRunner.dropColumn('comments', 'targetId');
    await queryRunner.dropColumn('comments', 'type');
    await queryRunner.query(`ALTER TABLE comments DROP CONSTRAINT IF EXISTS "FK_comments_author"`);
    await queryRunner.dropColumn('comments', 'authorId');
  }
}
