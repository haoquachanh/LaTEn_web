import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { DictionaryEntity } from '@entities/dictionary.entity';

@Injectable()
export class DictionaryService {
    constructor(
        @InjectRepository(DictionaryEntity)
        private readonly userRepository: Repository<DictionaryEntity>,
    ) {}

    async getAllDictionarys(): Promise<DictionaryEntity[]> {
        return await this.userRepository.find();
    }

    async create(word: DictionaryEntity): Promise<DictionaryEntity>{
        return await this.userRepository.save(word);
    }

    async update(id: string, user: DictionaryEntity): Promise<UpdateResult>{
        return await this.userRepository.update(id, user);
    }

    async delete(id: string): Promise<DeleteResult>{
        return await this.userRepository.delete(id);
    }
}