import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { DictionaryEntity } from '@entities/dictionary.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DictionaryEntity)
    private readonly dictionaryRepository: Repository<DictionaryEntity>,
  ) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }

  async update(id: string, user: UserEntity): Promise<UpdateResult> {
    return await this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async addToFavorite(userId: number, wordId: number): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.favoriteWords', 'favoriteWords')
      .where('user.id = :userId', { userId: userId })
      .getOne();
    const word = await this.dictionaryRepository.findOne({
      where: { id: wordId },
    });
    if (user && word) {
      user.favoriteWords.push(word);
      await this.userRepository.save(user);
    }
  }
}
