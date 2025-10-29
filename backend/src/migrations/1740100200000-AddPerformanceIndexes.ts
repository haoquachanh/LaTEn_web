import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1740100200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_POSTS_TYPE" ON posts (type)`);
    
    await queryRunner.query(`
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'examinations' AND column_name = 'userId') THEN
          CREATE INDEX IF NOT EXISTS "IDX_EXAMINATIONS_USER" ON examinations ("userId");
        ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'examinations' AND column_name = 'createdBy') THEN
          CREATE INDEX IF NOT EXISTS "IDX_EXAMINATIONS_USER" ON examinations ("createdBy");
        END IF;
      END $$;
    `);
    
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_EXAMINATIONS_STATUS" ON examinations (status)`);
    
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_COMMENTS_USER" ON comments ("userId")`);
    
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_COMMENT_REPLIES_COMMENT" ON comment_replies ("commentId")`);
    
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_POST_LIKES_POST_USER" ON post_likes ("postId", "userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_POSTS_TYPE"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_EXAMINATIONS_USER"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_EXAMINATIONS_STATUS"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_COMMENTS_USER"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_COMMENT_REPLIES_COMMENT"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_POST_LIKES_POST_USER"`);
  }
}
