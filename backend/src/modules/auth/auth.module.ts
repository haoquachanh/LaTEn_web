import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/common/security/local.strategy';
import { JwtStrategy } from 'src/common/security/jwt.strategy';

@Module({
   imports: [
      PassportModule,
      JwtModule.registerAsync(jwtConfig),
      TypeOrmModule.forFeature([UserEntity]),
   ],
   providers: [AuthService, LocalStrategy, JwtStrategy],
   controllers: [AuthController],
})
export class AuthModule {}
