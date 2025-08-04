import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Question, QuestionMode } from '../entities/question.entity';

// Load environment variables
dotenv.config();

async function fixQuestionSeed() {
  // Create DataSource with current environment config
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'laten',
    entities: ['src/entities/**/*.entity.{ts,js}'],
    synchronize: false,
    logging: false,
  });

  try {
    // Initialize database connection
    await dataSource.initialize();
    console.log('🔌 Database connection established');

    // Get existing questions
    const questions = await dataSource.getRepository(Question).find();
    console.log(`📊 Found ${questions.length} questions in the database`);

    // Update questions missing mode property
    const questionRepository = dataSource.getRepository(Question);

    // Add QuestionMode.READING to all questions without mode
    await questionRepository.query(`
      UPDATE questions 
      SET mode = 'reading' 
      WHERE mode IS NULL
    `);

    console.log('✅ Updated all questions with missing mode');

    console.log('🎉 Question fix completed successfully!');
  } catch (error) {
    console.error('❌ Question fix failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the fixer
fixQuestionSeed();
