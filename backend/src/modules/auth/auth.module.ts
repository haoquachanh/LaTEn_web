import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@common/config/jwt.config';

@Module({
  imports:[
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
