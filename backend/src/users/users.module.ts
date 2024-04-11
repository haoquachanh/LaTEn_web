import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { DictionaryEntity } from '@entities/dictionary.entity';

@Module({
   imports: [TypeOrmModule.forFeature([UserEntity, DictionaryEntity])],
   providers: [UsersService],
   controllers: [UsersController],
})
export class UsersModule {}
