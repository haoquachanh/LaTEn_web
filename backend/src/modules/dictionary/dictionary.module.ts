import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryEntity } from '@entities/dictionary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DictionaryEntity])],
  providers: [DictionaryService],
  controllers: [DictionaryController],
})
export class DictionaryModule {}
