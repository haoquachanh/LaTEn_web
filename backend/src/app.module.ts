import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './common/config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from '@modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/common/envs/.env'
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
