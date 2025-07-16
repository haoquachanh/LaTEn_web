import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../src/common/typings/user-role.enum';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));

    await app.init();
  });

  beforeEach(async () => {
    // Clean up database before each test - safe cleanup
    try {
      await userRepository.clear();
    } catch (error) {
      // Ignore errors if table doesn't exist yet
    }
  });

  afterAll(async () => {
    // Final cleanup and close app
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      const registerDto = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        birth: '1990-01-01',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(registerDto.email);
          expect(res.body.user.fullname).toBe(registerDto.fullname);
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should return 409 for duplicate email', async () => {
      const registerDto = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        birth: '1990-01-01',
      };

      // Register first user
      await request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(201);

      // Try to register with same email
      return request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(409);
    });

    it('should return 400 for invalid email format', () => {
      const registerDto = {
        fullname: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        phone: '1234567890',
        birth: '1990-01-01',
      };

      return request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(400);
    });

    it('should return 400 for short password', () => {
      const registerDto = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: '123',
        phone: '1234567890',
        birth: '1990-01-01',
      };

      return request(app.getHttpServer()).post('/auth/register').send(registerDto).expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a test user
      const registerDto = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        birth: '1990-01-01',
      };

      await request(app.getHttpServer()).post('/auth/register').send(registerDto);
    });

    it('should login with valid credentials', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(loginDto.email);
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should return 401 for invalid email', () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer()).post('/auth/login').send(loginDto).expect(401);
    });

    it('should return 401 for invalid password', () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer()).post('/auth/login').send(loginDto).expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Create and login a test user
      const registerDto = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        birth: '1990-01-01',
      };

      const registerResponse = await request(app.getHttpServer()).post('/auth/register').send(registerDto);

      accessToken = registerResponse.body.access_token;
    });

    it('should get user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('fullname');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer()).get('/auth/profile').set('Authorization', 'Bearer invalid-token').expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Create and login a test user
      const registerDto = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
        birth: '1990-01-01',
      };

      const registerResponse = await request(app.getHttpServer()).post('/auth/register').send(registerDto);

      accessToken = registerResponse.body.access_token;
    });

    it('should refresh token with valid token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).post('/auth/refresh').expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
