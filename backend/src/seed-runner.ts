import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds/seeds.module';
import { PostsSeedService } from './seeds/posts.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);
  const postsSeedService = app.get(PostsSeedService);

  try {
    // Run the seed service
    await postsSeedService.seed();
    console.log('Seeds completed successfully!');
  } catch (error) {
    console.error('Seeds failed!', error);
  } finally {
    await app.close();
  }
}

bootstrap();
