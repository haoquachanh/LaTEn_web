import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: process.env.DB_TYPE as any || "postgres",
    database: process.env.DB_DATABASE as any || "postgres",
    host: process.env.DB_HOST || "postgres",
    port: parseInt(process.env.DB_PORT as string) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "578722",
    entities: [__dirname + '/../../entities/**/*.entity{.ts,.js}'],
    synchronize: true, // production only
  }),
};
