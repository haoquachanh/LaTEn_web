import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt'; 
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,

    ) {}
    async singup(user: UserEntity): Promise<UserEntity> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        return await this.userRepository.save(user);
    }
    async validateUser(email: string, password: string): Promise<any> {
        const foundUser = await this.userRepository.findOneBy({ email });
        if (foundUser) {
          if (await bcrypt.compare(password, foundUser.password)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = foundUser;
            return result;
          }
          return null;
        }
        return null;
      }
    
      async login(user: any): Promise<{ access_token: string }> {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
}
