import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '@entities/user.entity';
import { DictionaryEntity } from '@entities/dictionary.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  async getUserById(id: string | number): Promise<UserEntity> {
    const theId = typeof id === 'string' ? parseInt(id) : id;
    if (!theId) {
      throw new UnprocessableEntityException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          id: 'userIdMustBeNumber',
        },
      });
    }
    const theUser = await this.userRepository.findOneBy({ id: theId });
    if (!theUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'userNotFound',
        },
      });
    }
    delete theUser.password;
    return theUser;
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    const clonedPayload = { ...user };
    if (clonedPayload.email) {
      const userObject = await this.userRepository.findOne({
        where: { email: clonedPayload.email },
      });
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }
    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    const result = await this.userRepository.save(clonedPayload);
    // delete result.password;
    return result;
  }

  async update(id: string, user: UpdateUserDto): Promise<UpdateResult> {
    const theId = parseInt(id);
    const theUser = await this.userRepository.findOneBy({ id: theId });
    if (!theUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'userNotFound',
        },
      });
    }
    return await this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
