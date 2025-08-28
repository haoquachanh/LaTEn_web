import 'dotenv/config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'laten_db',
  synchronize: false,
  logging: true,
});

async function runMigration() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const queryRunner = AppDataSource.createQueryRunner();

    console.log('\n📋 Dropping likes and views columns from qanda_questions...');
    try {
      await queryRunner.query(`ALTER TABLE "qanda_questions" DROP COLUMN IF EXISTS "likes"`);
      console.log('✅ Dropped likes column from qanda_questions');
    } catch (e) {
      console.log('⚠️  likes column may not exist:', e.message);
    }

    try {
      await queryRunner.query(`ALTER TABLE "qanda_questions" DROP COLUMN IF EXISTS "views"`);
      console.log('✅ Dropped views column from qanda_questions');
    } catch (e) {
      console.log('⚠️  views column may not exist:', e.message);
    }

    console.log('\n📋 Dropping likes column from qanda_answers...');
    try {
      await queryRunner.query(`ALTER TABLE "qanda_answers" DROP COLUMN IF EXISTS "likes"`);
      console.log('✅ Dropped likes column from qanda_answers');
    } catch (e) {
      console.log('⚠️  likes column may not exist:', e.message);
    }

    console.log('\n📋 Dropping qanda_question_likes table...');
    try {
      await queryRunner.query(`DROP TABLE IF EXISTS "qanda_question_likes" CASCADE`);
      console.log('✅ Dropped qanda_question_likes table');
    } catch (e) {
      console.log('⚠️  qanda_question_likes table may not exist:', e.message);
    }

    console.log('\n📋 Dropping qanda_answer_likes table...');
    try {
      await queryRunner.query(`DROP TABLE IF EXISTS "qanda_answer_likes" CASCADE`);
      console.log('✅ Dropped qanda_answer_likes table');
    } catch (e) {
      console.log('⚠️  qanda_answer_likes table may not exist:', e.message);
    }

    await queryRunner.release();

    console.log('\n✅ Migration completed successfully!');
    console.log('🎉 Q&A system is now private (no likes/views)');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('\n🔌 Database connection closed');
  }
}

runMigration();
