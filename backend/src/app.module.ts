import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from '@modules/users/user.module';
import { DictionaryModule } from '@modules/dictionary/dictionary.module';
import { ExaminationModule } from '@modules/examination/examination.module';
import { CommentModule } from '@modules/comment/comment.module';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    HealthModule,
    AuthModule,
    UserModule,
    DictionaryModule,
    ExaminationModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
