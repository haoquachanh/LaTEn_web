import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedsModule } from './seeds/seeds.module';
import { PostsSeedService } from './seeds/posts.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the posts seed service from the seeds module
  const postsSeedService = app.select(SeedsModule).get(PostsSeedService);

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
