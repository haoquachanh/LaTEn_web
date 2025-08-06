import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { Question } from '@entities/question.entity';
import { UserEntity } from '@entities/user.entity';
import { CreateExaminationDto } from './dtos/create-examination.dto';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';

@Injectable()
export class ExaminationService {
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
    const { totalQuestions, startedAt, durationSeconds, title } = dto;
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const questions = await this.questionRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .orderBy('RANDOM()')
      .limit(totalQuestions)
      .getMany();

    const exam = this.examRepo.create({
      user,
      totalQuestions: dto.totalQuestions,
      durationSeconds: dto.durationSeconds,
      startedAt: dto.startedAt,
      title: dto.title,
      description: dto.description,
    });

    const savedExam = await this.examRepo.save(exam);

    const examQuestions = questions.map((q) =>
      this.examQuestionRepo.create({
        examination: savedExam,
        question: q,
      }),
    );

    await this.examQuestionRepo.save(examQuestions);

    return this.examRepo.findOne({
      where: { id: (await savedExam).id },
      relations: ['examinationQuestions', 'examinationQuestions.question'],
    });
  }

  async submitAnswer(dto: SubmitAnswerDto): Promise<ExaminationQuestion> {
    const exam = await this.examRepo.findOne({ where: { id: dto.examinationId } });
    const question = await this.questionRepo.findOne({ where: { id: dto.questionId } });

    if (!exam || !question) throw new NotFoundException('Exam or Question not found');

    const existing = await this.examQuestionRepo.findOne({
      where: { examination: { id: exam.id }, question: { id: question.id } },
    });

    if (existing) {
      existing.userAnswer = dto.userAnswer;
      existing.isCorrect = dto.isCorrect;
      return this.examQuestionRepo.save(existing);
    }

    const newAnswer = this.examQuestionRepo.create({
      examination: exam,
      question,
      userAnswer: dto.userAnswer,
      isCorrect: dto.isCorrect,
    });
    return this.examQuestionRepo.save(newAnswer);
  }

  async completeExamination(id: number): Promise<Examination> {
    const exam = await this.examRepo.findOne({
      where: { id },
      relations: ['examinationQuestions'],
    });
    if (!exam) throw new NotFoundException('Exam not found');

    exam.completedAt = new Date();
    exam.correctAnswers = exam.examinationQuestions.filter((q) => q.isCorrect).length;
    exam.score = (exam.correctAnswers / exam.totalQuestions) * 100;

    return this.examRepo.save(exam);
  }

  async getExaminationById(id: number): Promise<Examination> {
    const exam = await this.examRepo.findOne({
      where: { id },
      relations: ['examinationQuestions', 'examinationQuestions.question', 'user'],
    });

    if (!exam) throw new NotFoundException('Examination not found');
    return exam;
  }

  async getUserExaminations(userId: number): Promise<Examination[]> {
    return this.examRepo.find({
      where: { user: { id: userId } },
      order: { startedAt: 'DESC' },
      relations: ['user'],
    });
  }

  async cancelExamination(id: number): Promise<Examination> {
    const exam = await this.examRepo.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Examination not found');

    // Mark as completed with no score to indicate cancellation
    exam.completedAt = new Date();
    exam.score = 0;
    exam.correctAnswers = 0;

    return this.examRepo.save(exam);
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
