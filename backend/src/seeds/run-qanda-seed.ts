import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { QandASeed } from './qanda.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);
  const seeder = app.get(QandASeed);

  try {
    await seeder.run();
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
