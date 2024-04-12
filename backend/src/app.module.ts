import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from '@modules/users/user.module';
import { DictionaryModule } from '@modules/dictionary/dictionary.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    UserModule,
    DictionaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
