import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { typeOrmConfig } from './common/config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from '@modules/users/user.module';
import { QuestionModule } from '@modules/question/question.module';
import { CommentModule } from '@modules/comment/comment.module';
import { HealthModule } from '@modules/health/health.module';
import { AppConfigService } from './config/app-config.service';
import { ExaminationModule } from '@modules/examination/examination.module';
import { ExaminationAttemptModule } from '@modules/examination-attempt/examination-attempt.module';
import { PostModule } from '@modules/post/post.module';
import { QandAModule } from '@modules/qanda/qanda.module';
import { UploadModule } from '@modules/upload/upload.module';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { SeedsModule } from './seeds/seeds.module';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 900000, // 15 minutes
        limit: 500, // 500 requests per 15 minutes
      },
    ]),
    LoggerModule, // Global module for AppLoggerService
    HealthModule,
    AuthModule,
    UserModule,
    QuestionModule,
    ExaminationModule,
    CommentModule,
    ExaminationAttemptModule,
    PostModule,
    QandAModule,
    UploadModule,
    SeedsModule,
  ],
  controllers: [],
  providers: [
    AppConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AppConfigService],
})
export class AppModule {}
