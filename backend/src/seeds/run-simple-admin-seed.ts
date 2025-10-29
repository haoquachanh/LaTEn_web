import { DataSource } from 'typeorm';
import { createSimpleAdmin } from './create-simple-admin.seed';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// TypeORM data source configuration
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'laten_dev',
  entities: ['src/entities/**/*.entity.ts'],
  synchronize: false,
});

async function runSeed() {
  console.log('🌱 Starting admin seed...');
  console.log('📦 Connecting to database...');

  try {
    // Initialize data source
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Create simple admin
    await createSimpleAdmin(AppDataSource);

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

runSeed();
