#!/usr/bin/env ts-node

/**
 * Professional setup script for LaTEn Backend Development
 * Usage: npm run setup:dev | npm run setup:test | npm run setup:local
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface SetupOptions {
  skipDatabase?: boolean;
  environment?: 'development' | 'test';
}

async function setupDevelopment(options: SetupOptions = {}): Promise<void> {
  const { skipDatabase = false, environment = 'development' } = options;
  
  console.log(`🚀 Setting up LaTEn Backend ${environment.toUpperCase()} Environment...\n`);

  try {
    // 1. Setup environment files
    await setupEnvironmentFiles(environment);
    
    // 2. Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed.\n');

    // 3. Build project
    console.log('🔨 Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Project built successfully.\n');

    // 4. Setup database
    if (!skipDatabase) {
      await setupDatabase(environment);
    }

    // 5. Final instructions
    printNextSteps(environment);

  } catch (error) {
    console.error('❌ Setup failed:', (error as Error).message);
    process.exit(1);
  }
}

async function setupEnvironmentFiles(environment: string): Promise<void> {
  const envFile = `.env.${environment}`;
  const envPath = path.join(__dirname, '..', '.env');
  const envTemplatePath = path.join(__dirname, '..', envFile);

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envTemplatePath)) {
      console.log(`📄 Creating .env from ${envFile} template...`);
      fs.copyFileSync(envTemplatePath, envPath);
      console.log('✅ .env file created.\n');
    } else {
      console.log(`⚠️  ${envFile} template not found. Creating basic .env...\n`);
      const basicEnv = `NODE_ENV=${environment}\nPORT=3000\n`;
      fs.writeFileSync(envPath, basicEnv);
    }
  } else {
    console.log('✅ .env file already exists.\n');
  }
}

async function setupDatabase(environment: string): Promise<void> {
  console.log('🗄️  Setting up database...');
  
  if (environment === 'test') {
    // Start test database with Docker
    try {
      console.log('� Starting test database container...');
      execSync('docker-compose -f docker-compose.test.yml up -d', { stdio: 'inherit' });
      
      // Wait for database to be ready
      console.log('⏳ Waiting for database to be ready...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log('✅ Test database started.\n');
    } catch (error) {
      console.log('⚠️  Could not start test database. Make sure Docker is running.\n');
      return;
    }
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  try {
    execSync('npm run seed:admin', { stdio: 'inherit' });
    console.log('✅ Admin user created.\n');
  } catch (error) {
    console.log('⚠️  Could not create admin user. Database may not be accessible.\n');
  }
}

function printNextSteps(environment: string): void {
  console.log('🎉 Development setup completed!\n');
  
  if (environment === 'development') {
    console.log('📋 Next steps for LOCAL DEVELOPMENT:');
    console.log('1. Install PostgreSQL locally (if not installed)');
    console.log('2. Create database: createdb laten_dev');
    console.log('3. Update .env with your local PostgreSQL credentials');
    console.log('4. Run: npm run start:dev\n');
  } else if (environment === 'test') {
    console.log('📋 Next steps for TESTING:');
    console.log('1. Run: npm test');
    console.log('2. Run: npm run test:e2e\n');
  }

  console.log('🔐 Default admin credentials:');
  console.log(`Email: admin@laten.${environment === 'development' ? 'local' : 'test'}`);
  console.log('Password: Dev_Admin_2025! (or Test_Admin_2025!)');
  console.log('\n⚠️  Remember to change admin password in production!');
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const environment = args.includes('--test') ? 'test' : 'development';
  const skipDatabase = args.includes('--skip-db');
  
  setupDevelopment({ environment, skipDatabase });
}

export { setupDevelopment };
