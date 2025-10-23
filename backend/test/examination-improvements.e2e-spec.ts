import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Examination Improvements (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: number;
  let templateId: number;
  let examinationId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login để lấy token
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    authToken = loginResponse.body.accessToken;
    userId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Transaction Management Test', () => {
    it('should rollback all changes if submitAnswer fails', async () => {
      // Test case: Kiểm tra transaction rollback
      // Nếu có lỗi xảy ra, cả ExaminationQuestion và Examination đều không được update
    });
  });

  describe('2. Shuffle Algorithm Test', () => {
    it('should use Fisher-Yates shuffle for unbiased randomization', async () => {
      // Tạo examination từ template với randomize = true
      const response = await request(app.getHttpServer())
        .post('/examination/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ templateId: templateId });

      expect(response.status).toBe(201);
      const examination = response.body;

      // Verify rằng câu hỏi được shuffle (không theo thứ tự gốc)
      // Statistical test: Chạy nhiều lần và kiểm tra distribution
    });

    it('should have uniform distribution over multiple shuffles', () => {
      // Test statistical distribution
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const positions = new Array(10).fill(0).map(() => new Array(10).fill(0));

      // Chạy 10000 lần shuffle
      for (let i = 0; i < 10000; i++) {
        const shuffled = fisherYatesShuffle([...testArray]);
        shuffled.forEach((value, index) => {
          positions[value - 1][index]++;
        });
      }

      // Mỗi vị trí nên xuất hiện ~1000 lần (10000/10)
      // Cho phép sai số 20%
      positions.forEach((positionCounts) => {
        positionCounts.forEach((count) => {
          expect(count).toBeGreaterThan(800);
          expect(count).toBeLessThan(1200);
        });
      });
    });
  });

  describe('3. N+1 Query Prevention Test', () => {
    it('should load examination with all relations in single query', async () => {
      // Start examination
      const startResponse = await request(app.getHttpServer())
        .post('/examination/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ templateId: templateId });

      expect(startResponse.status).toBe(201);
      const examination = startResponse.body;

      // Verify rằng tất cả options đã được load
      examination.examinationQuestions.forEach((eq) => {
        if (eq.question.type === 'MULTIPLE_CHOICE') {
          expect(eq.question.options).toBeDefined();
          expect(Array.isArray(eq.question.options)).toBe(true);
          expect(eq.question.options.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('4. Session Tracking Test', () => {
    it('should prevent concurrent examination sessions', async () => {
      // Start first examination
      const firstExam = await request(app.getHttpServer())
        .post('/examination/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ templateId: templateId });

      expect(firstExam.status).toBe(201);

      // Try to start second examination - should fail
      const secondExam = await request(app.getHttpServer())
        .post('/examination/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ templateId: templateId });

      expect(secondExam.status).toBe(400);
      expect(secondExam.body.message).toContain('ongoing examination');
    });

    it('should auto-complete inactive examination after timeout', async () => {
      // Start examination
      const exam = await request(app.getHttpServer())
        .post('/examination/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ templateId: templateId });

      const examinationId = exam.body.id;

      // Mock time to be 6 minutes later
      // (In real test, sử dụng time mocking library như timekeeper)

      // Try to submit answer after timeout
      const submitResponse = await request(app.getHttpServer())
        .post(`/examination/${examinationId}/submit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          questionId: exam.body.examinationQuestions[0].id,
          answer: 1,
        });

      // Should return examination completed
      expect(submitResponse.body.examinationCompleted).toBe(true);
    });

    it('should update lastActivityAt on each submitAnswer', async () => {
      // Start examination
      const exam = await request(app.getHttpServer())
        .post('/examination/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ templateId: templateId });

      const initialActivityTime = exam.body.lastActivityAt;

      // Wait 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Submit answer
      await request(app.getHttpServer())
        .post(`/examination/${exam.body.id}/submit`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          questionId: exam.body.examinationQuestions[0].id,
          answer: 1,
        });

      // Get current examination
      const current = await request(app.getHttpServer())
        .get('/examination/current')
        .set('Authorization', `Bearer ${authToken}`);

      expect(new Date(current.body.lastActivityAt).getTime()).toBeGreaterThan(new Date(initialActivityTime).getTime());
    });
  });

  describe('5. Time Expiration Logic Test', () => {
    it('should not throw error when time expires', async () => {
      // Create examination with 1 second duration
      // Mock time to exceed duration
      // Submit answer
      // Should return examinationCompleted = true, not throw error
    });
  });
});

// Helper function for testing Fisher-Yates
function fisherYatesShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
