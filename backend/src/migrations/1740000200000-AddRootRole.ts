import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRootRole1740000200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'root' to the role enum type
    await queryRunner.query(`
      ALTER TYPE "user_role_enum" ADD VALUE IF NOT EXISTS 'root';
    `);

    // Note: The enum values 'admin', 'teacher', 'student', 'user' already exist
    // This migration only adds 'root' for super admin role
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL doesn't support removing enum values directly
    // Would require recreating the enum type which is complex
    // In practice, having an extra enum value doesn't cause issues
    console.log('Removing enum values is not supported in PostgreSQL');
    console.log('The "root" role will remain in the enum type');
  }
}
