import { ClassSerializerInterceptor, Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { CacheConfig } from './config/cache.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 900000,
        limit: 500,
      },
    ]),
    LoggerModule,
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
