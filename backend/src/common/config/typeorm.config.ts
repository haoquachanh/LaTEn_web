import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: process.env.DB_TYPE as any,
    database: process.env.DB_DATABASE as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [__dirname + '/../../entities/**/*.entity{.ts,.js}'],
    synchronize: true, // production only
  }),
};
