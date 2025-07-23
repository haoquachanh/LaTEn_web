import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UserRole } from '@common/typings/user-role.enum';
import { refreshTokenConfig } from '@common/config/jwt.config';

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

  async login(
    credentials: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string; user: Partial<UserEntity> }> {
    const foundUser = await this.validateUser(credentials);

    const payload = {
      email: foundUser.email,
      id: foundUser.id,
      role: foundUser.role,
    };

    const access_token = this.jwtService.sign(payload);

    const refresh_token = this.jwtService.sign(payload, {
      secret: refreshTokenConfig.secret,
      expiresIn: refreshTokenConfig.expiresIn,
    });

    await this.userRepository.update(foundUser.id, {
      refreshToken: refresh_token,
      refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    });

    // Return user without password
    const { password, ...userWithoutPassword } = foundUser;

    return {
      access_token,
      refresh_token,
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

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token?: string;
  }> {
    const user = await this.userRepository.findOne({
      where: { refreshToken },
    });

    if (!user || new Date(user.refreshTokenExpires) < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    let newRefreshToken: string | undefined;
    const expiresInDays = (user.refreshTokenExpires.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    if (expiresInDays < 1) {
      newRefreshToken = this.jwtService.sign(payload, {
        secret: refreshTokenConfig.secret,
        expiresIn: refreshTokenConfig.expiresIn,
      });

      await this.userRepository.update(user.id, {
        refreshToken: newRefreshToken,
        refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }

    return {
      access_token,
      refresh_token: newRefreshToken,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken: null,
      refreshTokenExpires: null,
    });
  }
}
