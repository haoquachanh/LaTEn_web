import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { DictionaryEntity } from '@entities/dictionary.entity';
import { JwtStrategy } from '@common/security/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DictionaryEntity])],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
})
export class UserModule {}
