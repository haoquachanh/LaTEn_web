import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@common/typings/user-role.enum';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { refreshTokenConfig } from '@common/config/jwt.config';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<UserEntity>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockUser: UserEntity = {
    id: 1,
    fullname: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: UserRole.USER,
    phone: '1234567890',
    birth: '1990-01-01',
    created: new Date(),
    updated: new Date(),
    refreshToken: 'refresh-token',
    refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      fullname: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      birth: '1990-01-01',
    };

    it('should register a new user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockedBcrypt.genSalt.mockResolvedValue('salt' as never);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 'salt');
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: 'hashedPassword123',
        fullname: registerDto.fullname,
        phone: registerDto.phone,
        birth: registerDto.birth,
        role: UserRole.USER,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: mockUser.id,
          fullname: mockUser.fullname,
          email: mockUser.email,
          role: mockUser.role,
          phone: mockUser.phone,
          birth: mockUser.birth,
          created: mockUser.created,
          updated: mockUser.updated,
          refreshToken: mockUser.refreshToken,
          refreshTokenExpires: mockUser.refreshTokenExpires,
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });
  });

  describe('validateUser', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should validate user successfully', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(loginDto);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully and return tokens', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token') // First call for access token
        .mockReturnValueOnce('refresh-token'); // Second call for refresh token

      const result = await service.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
        role: mockUser.role,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          email: mockUser.email,
          id: mockUser.id,
          role: mockUser.role,
        },
        {
          secret: refreshTokenConfig.secret,
          expiresIn: refreshTokenConfig.expiresIn,
        },
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, {
        refreshToken: 'refresh-token',
        refreshTokenExpires: expect.any(Date),
      });
      expect(result).toEqual({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        user: {
          id: mockUser.id,
          fullname: mockUser.fullname,
          email: mockUser.email,
          role: mockUser.role,
          phone: mockUser.phone,
          birth: mockUser.birth,
          created: mockUser.created,
          updated: mockUser.updated,
          refreshToken: mockUser.refreshToken,
          refreshTokenExpires: mockUser.refreshTokenExpires,
        },
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({
        id: mockUser.id,
        fullname: mockUser.fullname,
        email: mockUser.email,
        role: mockUser.role,
        phone: mockUser.phone,
        birth: mockUser.birth,
        created: mockUser.created,
        updated: mockUser.updated,
        refreshToken: mockUser.refreshToken,
        refreshTokenExpires: mockUser.refreshTokenExpires,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('refreshToken', () => {
    it('should generate new access token with existing refresh token', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken('valid-refresh-token');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { refreshToken: 'valid-refresh-token' },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
        role: mockUser.role,
      });
      expect(result).toEqual({
        access_token: 'new-access-token',
      });
    });

    it('should generate new access token and refresh token when current one is about to expire', async () => {
      const userWithExpiringToken = {
        ...mockUser,
        refreshTokenExpires: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      };

      mockUserRepository.findOne.mockResolvedValue(userWithExpiringToken);
      mockJwtService.sign.mockReturnValueOnce('new-access-token').mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshToken('expiring-refresh-token');

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userWithExpiringToken.id, {
        refreshToken: 'new-refresh-token',
        refreshTokenExpires: expect.any(Date),
      });
      expect(result).toEqual({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token is expired', async () => {
      const userWithExpiredToken = {
        ...mockUser,
        refreshTokenExpires: new Date(Date.now() - 1000), // 1 second ago
      };
      mockUserRepository.findOne.mockResolvedValue(userWithExpiredToken);

      await expect(service.refreshToken('expired-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should clear refresh token for user', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 } as any);

      await service.logout(1);

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, {
        refreshToken: null,
        refreshTokenExpires: null,
      });
    });
  });
});
