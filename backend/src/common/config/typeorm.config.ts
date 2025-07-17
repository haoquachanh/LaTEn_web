import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const environment = process.env.NODE_ENV || 'development';

  // Base configuration
  const baseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    entities: [__dirname + '/../../entities/**/*.entity{.ts,.js}'],
    synchronize: environment !== 'production', // Only in dev/test
    logging: environment === 'development' ? ['query', 'error'] : false,
  };

  // Environment-specific configurations
  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'laten_dev',
      };

    case 'test':
      return {
        ...baseConfig,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5433, // Different port for test
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'laten_test',
        dropSchema: true, // Clean slate for each test
      };

    case 'production':
      return {
        ...baseConfig,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: {
          rejectUnauthorized: false, // For cloud databases
        },
        synchronize: false, // Never auto-sync in production
      };

    default:
      throw new Error(`Unknown environment: ${environment}`);
  }
};

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => getDatabaseConfig(),
};
