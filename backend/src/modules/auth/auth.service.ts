import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UserRole } from '@common/typings/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string; user: Partial<UserEntity> }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // Create new user
    const newUser = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      fullname: registerDto.fullname,
      phone: registerDto.phone,
      birth: registerDto.birth,
      role: UserRole.USER,
    });

    const savedUser = await this.userRepository.save(newUser);

    // Generate JWT token
    const payload = {
      email: savedUser.email,
      id: savedUser.id,
      role: savedUser.role,
    };

    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password, ...userWithoutPassword } = savedUser;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async validateUser(credentials: LoginDto): Promise<UserEntity> {
    const foundUser = await this.userRepository.findOneBy({
      email: credentials.email,
    });

    if (foundUser && (await bcrypt.compare(credentials.password, foundUser.password))) {
      return foundUser;
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  async login(credentials: LoginDto): Promise<{ access_token: string; user: Partial<UserEntity> }> {
    const foundUser = await this.validateUser(credentials);

    const payload = {
      email: foundUser.email,
      id: foundUser.id,
      role: foundUser.role,
    };

    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password, ...userWithoutPassword } = foundUser;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async getProfile(userId: number): Promise<Partial<UserEntity>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteWords'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async refreshToken(user: any): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
