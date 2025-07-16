import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../../common/typings/user-role.enum';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

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
    favoriteWords: [],
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
          favoriteWords: mockUser.favoriteWords,
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

    it('should login user successfully', async () => {
      const validateUserSpy = jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(validateUserSpy).toHaveBeenCalledWith(loginDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
        role: mockUser.role,
      });
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
          favoriteWords: mockUser.favoriteWords,
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
        relations: ['favoriteWords'],
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
        favoriteWords: mockUser.favoriteWords,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('refreshToken', () => {
    const userPayload = {
      id: 1,
      email: 'test@example.com',
      role: UserRole.USER,
    };

    it('should generate new access token', async () => {
      mockJwtService.sign.mockReturnValue('new-jwt-token');

      const result = await service.refreshToken(userPayload);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: userPayload.email,
        id: userPayload.id,
        role: userPayload.role,
      });
      expect(result).toEqual({
        access_token: 'new-jwt-token',
      });
    });
  });
});
