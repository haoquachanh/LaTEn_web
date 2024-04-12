import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { DictionaryEntity } from '@entities/dictionary.entity';

@Controller('api/dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}
  @Get('test')
  test(): string {
    return 'Dictionary api is available';
  }

  @Get()
  async getAll(): Promise<any> {
    return this.dictionaryService.getAllDictionarys();
  }

  @Post()
  async create(@Body() word: DictionaryEntity): Promise<DictionaryEntity> {
    return this.dictionaryService.create(word);
  }

  @Put(':id')
  async update(
    @Body() user: DictionaryEntity,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.dictionaryService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.dictionaryService.delete(id);
  }
}
