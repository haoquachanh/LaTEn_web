import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from '@modules/users/user.module';
import { QuestionModule } from '@modules/question/question.module';
import { CommentModule } from '@modules/comment/comment.module';
import { HealthModule } from '@modules/health/health.module';
import { AppConfigService } from './config/app-config.service';
import { ExaminationModule } from '@modules/examination/examination.module';
import { ExaminationAttemptModule } from '@modules/examination-attempt/examination-attempt.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    HealthModule,
    AuthModule,
    UserModule,
    QuestionModule,
    ExaminationModule,
    CommentModule,
    ExaminationAttemptModule,
  ],
  controllers: [],
  providers: [
    AppConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [AppConfigService],
})
export class AppModule {}
