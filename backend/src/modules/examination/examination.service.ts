import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { Question } from '@entities/question.entity';
import { UserEntity } from '@entities/user.entity';
import { CreateExaminationDto } from './dtos/create-examination.dto';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { EXAMINATION_CONSTANTS } from '@common/constants/examination.constants';

@Injectable()
export class ExaminationService {
  private readonly logger = new Logger(ExaminationService.name);
  constructor(
    @InjectRepository(Examination)
    private readonly examRepo: Repository<Examination>,

    @InjectRepository(ExaminationQuestion)
    private readonly examQuestionRepo: Repository<ExaminationQuestion>,

    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateExaminationDto): Promise<Examination> {
    this.logger.log(`Creating examination: ${dto.title || 'Untitled'} for user ${dto.userId}`);

    const { totalQuestions, startedAt, durationSeconds, title } = dto;

    try {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) {
        this.logger.error(`User not found: ${dto.userId}`);
        throw new NotFoundException('User not found');
      }

      // Use query builder with eager loading to prevent N+1
      const questions = await this.questionRepo
        .createQueryBuilder('question')
        .leftJoinAndSelect('question.options', 'options')
        .orderBy('RANDOM()')
        .limit(totalQuestions)
        .getMany();

      if (questions.length < totalQuestions) {
        this.logger.warn(`Requested ${totalQuestions} questions but only ${questions.length} available`);
      }

      const exam = this.examRepo.create({
        user,
        totalQuestions: dto.totalQuestions,
        durationSeconds: dto.durationSeconds,
        startedAt: dto.startedAt,
        title: dto.title,
        description: dto.description,
      });

      const savedExam = await this.examRepo.save(exam);
      this.logger.log(`Examination created successfully: ID ${savedExam.id}`);

      const examQuestions = questions.map((q) =>
        this.examQuestionRepo.create({
          examination: savedExam,
          question: q,
        }),
      );

      await this.examQuestionRepo.save(examQuestions);
      this.logger.log(`${examQuestions.length} questions added to examination ${savedExam.id}`);

      // Use optimized query with proper relations
      return this.getExaminationById(savedExam.id);
    } catch (error) {
      this.logger.error(`Failed to create examination: ${error.message}`, error.stack);
      throw error;
    }
  }

  async submitAnswer(dto: SubmitAnswerDto): Promise<ExaminationQuestion> {
    this.logger.log(`Submitting answer for examination ${dto.examinationId}, question ${dto.questionId}`);

    try {
      const exam = await this.examRepo.findOne({ where: { id: dto.examinationId } });
      const question = await this.questionRepo.findOne({ where: { id: dto.questionId } });

      if (!exam || !question) {
        this.logger.error('Exam or Question not found');
        throw new NotFoundException('Exam or Question not found');
      }

      const existing = await this.examQuestionRepo.findOne({
        where: { examination: { id: exam.id }, question: { id: question.id } },
      });

      if (existing) {
        existing.userAnswer = dto.userAnswer;
        existing.isCorrect = dto.isCorrect;
        const saved = await this.examQuestionRepo.save(existing);
        this.logger.log(`Answer updated for question ${dto.questionId}`);
        return saved;
      }

      const newAnswer = this.examQuestionRepo.create({
        examination: exam,
        question,
        userAnswer: dto.userAnswer,
        isCorrect: dto.isCorrect,
      });

      const saved = await this.examQuestionRepo.save(newAnswer);
      this.logger.log(`New answer saved for question ${dto.questionId}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to submit answer: ${error.message}`, error.stack);
      throw error;
    }
  }

  async completeExamination(id: number): Promise<Examination> {
    this.logger.log(`Completing examination: ${id}`);

    try {
      const exam = await this.examRepo.findOne({
        where: { id },
        relations: ['examinationQuestions', 'user'],
      });

      if (!exam) {
        this.logger.error(`Examination not found: ${id}`);
        throw new NotFoundException('Exam not found');
      }

      exam.completedAt = new Date();
      exam.correctAnswers = exam.examinationQuestions.filter((q) => q.isCorrect).length;
      exam.score = (exam.correctAnswers / exam.totalQuestions) * 100;

      const savedExam = await this.examRepo.save(exam);

      this.logger.log(
        `Examination ${id} completed. Score: ${exam.score}, Correct: ${exam.correctAnswers}/${exam.totalQuestions}`,
      );

      // Update leaderboard scores
      try {
        // Inject the LeaderboardService using constructor in a real application
        // For this example, we can update the leaderboard scores in the controller
        // or through an event emitter pattern
      } catch (error) {
        this.logger.error('Failed to update leaderboard scores:', error);
        // Don't fail the entire operation if leaderboard update fails
      }

      return savedExam;
    } catch (error) {
      this.logger.error(`Failed to complete examination: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getExaminationById(id: number): Promise<Examination> {
    this.logger.log(`Fetching examination by ID: ${id}`);

    // Use query builder for optimized loading
    const exam = await this.examRepo
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examinationQuestions', 'eq')
      .leftJoinAndSelect('eq.question', 'q')
      .leftJoinAndSelect('q.options', 'options')
      .leftJoinAndSelect('exam.user', 'user')
      .where('exam.id = :id', { id })
      .getOne();

    if (!exam) {
      this.logger.error(`Examination not found: ${id}`);
      throw new NotFoundException('Examination not found');
    }

    this.logger.log(`Examination ${id} fetched successfully`);
    return exam;
  }

  async getUserExaminations(userId: number): Promise<Examination[]> {
    this.logger.log(`Fetching examinations for user: ${userId}`);

    return this.examRepo.find({
      where: { user: { id: userId } },
      order: { startedAt: 'DESC' },
      relations: ['user'],
    });
  }

  async cancelExamination(id: number): Promise<Examination> {
    this.logger.log(`Cancelling examination: ${id}`);

    const exam = await this.examRepo.findOne({ where: { id } });
    if (!exam) {
      this.logger.error(`Examination not found: ${id}`);
      throw new NotFoundException('Examination not found');
    }

    // Mark as completed with no score to indicate cancellation
    exam.completedAt = new Date();
    exam.score = 0;
    exam.correctAnswers = 0;

    const saved = await this.examRepo.save(exam);
    this.logger.log(`Examination ${id} cancelled successfully`);
    return saved;
  }

  async getExaminationStats(userId: number): Promise<any> {
    const exams = await this.examRepo.find({
      where: {
        user: { id: userId },
        completedAt: Not(IsNull()),
      },
      order: { completedAt: 'DESC' },
    });

    return {
      totalExams: exams.length,
      averageScore: exams.length > 0 ? exams.reduce((acc, exam) => acc + exam.score, 0) / exams.length : 0,
      bestScore: exams.length > 0 ? Math.max(...exams.map((exam) => exam.score)) : 0,
      recentExams: exams.slice(0, 5),
    };
  }

  async searchExaminations(query: string, page: number = 1, limit: number = 10): Promise<[Examination[], number]> {
    return this.examRepo
      .createQueryBuilder('examination')
      .leftJoinAndSelect('examination.user', 'user')
      .where('examination.title LIKE :query OR examination.description LIKE :query', {
        query: `%${query}%`,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('examination.startedAt', 'DESC')
      .getManyAndCount();
  }
}
