import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
// import { UserLoginDto } from '@modules/users/dtos/userlogin';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async register(user: UserEntity): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return await this.userRepository.save(user);
  }
  async validateUser(credentials: LoginDto): Promise<UserEntity> {
    const foundUser = await this.userRepository.findOneBy({
      email: credentials.email,
    });
    if (foundUser) {
      console.log(foundUser);
      if (await bcrypt.compare(credentials.password, foundUser.password)) {
        return foundUser;
      }
      throw new UnauthorizedException();
    }
    return null;
  }

  async login(credentials: LoginDto): Promise<{ access_token: string }> {
    const foundUser = await this.validateUser(credentials);
    if (!foundUser) throw new NotFoundException();
    const payload = {
      email: foundUser.email,
      id: foundUser.id,
      role: foundUser.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
