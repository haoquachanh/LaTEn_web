import { DataSource } from 'typeorm';
import { createAdminUser } from './admin.seed';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function runAdminSeed() {
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

    // Create admin user
    await createAdminUser(dataSource);

    console.log('🎉 Admin seeding completed successfully!');
  } catch (error) {
    console.error('❌ Admin seeding failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seeder
runAdminSeed();
