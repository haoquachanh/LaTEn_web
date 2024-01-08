import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async create(user: UserEntity): Promise<UserEntity>{
        return await this.userRepository.save(user);
    }

    async update(id: string, user: UserEntity): Promise<UpdateResult>{
        return await this.userRepository.update(id, user);
    }

    async delete(id: string): Promise<DeleteResult>{
        return await this.userRepository.delete(id);
    }
}