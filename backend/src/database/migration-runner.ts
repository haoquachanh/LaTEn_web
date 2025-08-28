import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

/**
 * Simplified Database Migration Runner
 * Runs migrations without full app context to avoid circular dependencies
 */
export class MigrationRunner {
  private static createDataSource(): DataSource {
    // Load environment variables
    dotenv.config();

    const configService = new ConfigService();

    return new DataSource({
      type: 'postgres',
      host: configService.get('DB_HOST', 'localhost'),
      port: configService.get('DB_PORT', 5432),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: ['src/entities/**/*.entity.{ts,js}'],
      migrations: ['src/migrations/**/*.{ts,js}'],
      synchronize: false, // Never auto-sync in migrations
      logging: configService.get('NODE_ENV') === 'development' ? 'all' : ['error'],
      ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  static async runMigrations(): Promise<void> {
    console.log('🔄 Starting database migration check...');

    try {
      const dataSource = this.createDataSource();

      // Initialize connection
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
        console.log('📡 Database connection established');
      }

      // Check for pending migrations
      const pendingMigrations = await dataSource.showMigrations();

      if (pendingMigrations) {
        console.log('📋 Found pending migrations, running them...');
        await dataSource.runMigrations();
        console.log('✅ Database migrations completed successfully');
      } else {
        console.log('✅ No pending migrations found');
      }

      // Close connection
      await dataSource.destroy();
    } catch (error) {
      console.error('❌ Migration failed:', error.message);

      // In production, we might want to fail fast
      if (process.env.NODE_ENV === 'production') {
        console.error('🚨 Production migration failure - exiting');
        process.exit(1);
      }

      // In development, just warn and continue
      console.warn('⚠️  Development environment - continuing despite migration failure');

      // Try to create database if it doesn't exist
      if (error.message.includes('database') && error.message.includes('does not exist')) {
        console.log('💡 Database might not exist. Please create it manually:');
        console.log(`   CREATE DATABASE ${process.env.DB_DATABASE};`);
      }
    }
  }

  /**
   * Generate migration using TypeORM CLI
   */
  static async generateMigration(name: string): Promise<void> {
    console.log(`📝 To generate migration, run:`);
    console.log(`npx typeorm migration:generate src/migrations/${name} -d src/common/config/typeorm.config.ts`);
  }

  /**
   * Revert the last migration
   */
  static async revertMigration(): Promise<void> {
    try {
      const dataSource = this.createDataSource();

      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      await dataSource.undoLastMigration();
      console.log('✅ Successfully reverted last migration');

      await dataSource.destroy();
    } catch (error) {
      console.error('❌ Failed to revert migration:', error.message);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const argument = process.argv[3];

  switch (command) {
    case 'run':
      MigrationRunner.runMigrations();
      break;
    case 'generate':
      if (!argument) {
        console.error('❌ Migration name is required');
        console.log('Usage: npm run migration:generate MyMigrationName');
        process.exit(1);
      }
      MigrationRunner.generateMigration(argument);
      break;
    case 'revert':
      MigrationRunner.revertMigration();
      break;
    default:
      console.log('Available commands:');
      console.log('  run     - Run pending migrations');
      console.log('  generate <name> - Generate new migration');
      console.log('  revert  - Revert last migration');
  }
}
