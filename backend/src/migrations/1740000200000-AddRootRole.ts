import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRootRole1740000200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
          CREATE TYPE "user_role_enum" AS ENUM('admin', 'teacher', 'student', 'user', 'root');
          
          ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
          
          ALTER TABLE "users" 
            ALTER COLUMN "role" TYPE "user_role_enum" 
            USING "role"::text::"user_role_enum";
          
          ALTER TABLE "users" 
            ALTER COLUMN "role" SET DEFAULT 'user'::user_role_enum;
        ELSE
          ALTER TYPE "user_role_enum" ADD VALUE IF NOT EXISTS 'root';
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL doesn't support removing enum values directly
    // Would require recreating the enum type which is complex
    // In practice, having an extra enum value doesn't cause issues
    console.log('Removing enum values is not supported in PostgreSQL');
    console.log('The "root" role will remain in the enum type');
  }
}
