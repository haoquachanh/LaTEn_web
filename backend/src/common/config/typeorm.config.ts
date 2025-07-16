import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => {
    const isTest = process.env.NODE_ENV === 'test';
    return {
      type: (process.env.DB_TYPE as any) || 'postgres',
      database: (process.env.DB_DATABASE as any) || 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT as string) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '578722',
      entities: [__dirname + '/../../entities/**/*.entity{.ts,.js}'],
      synchronize: isTest || process.env.NODE_ENV === 'development', // Enable for test and dev
      dropSchema: isTest, // Drop and recreate schema for each test run
      logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : false,
    };
  },
};
