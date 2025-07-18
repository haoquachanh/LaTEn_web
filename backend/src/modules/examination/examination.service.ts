import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExaminationEntity, ExaminationType, ExaminationLevel } from '@entities/examination.entity';
import { Question, QuestionType } from '@entities/question.entity';
import { Answer } from '@entities/answer.entity';
import { ExaminationResult } from '@entities/examination-result.entity';
import { UserEntity } from '@entities/user.entity';

@Injectable()
export class ExaminationService {
  constructor(
    @InjectRepository(ExaminationEntity)
    private readonly examinationRepository: Repository<ExaminationEntity>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(ExaminationResult)
    private readonly resultRepository: Repository<ExaminationResult>,
  ) {}

  async getAllExaminations(): Promise<ExaminationEntity[]> {
    return this.examinationRepository.find({
      where: { isActive: true },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getExaminationById(id: number): Promise<ExaminationEntity> {
    const examination = await this.examinationRepository.findOne({
      where: { id, isActive: true },
      relations: ['questions', 'createdBy'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    return examination;
  }

  async getExaminationsByType(type: ExaminationType): Promise<ExaminationEntity[]> {
    return this.examinationRepository.find({
      where: { type, isActive: true },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getExaminationsByLevel(level: ExaminationLevel): Promise<ExaminationEntity[]> {
    return this.examinationRepository.find({
      where: { level, isActive: true },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async createExamination(
    examinationData: Partial<ExaminationEntity>,
    createdBy: UserEntity,
  ): Promise<ExaminationEntity> {
    const examination = this.examinationRepository.create({
      ...examinationData,
      createdBy,
    });

    return this.examinationRepository.save(examination);
  }

  async updateExamination(
    id: number,
    updateData: Partial<ExaminationEntity>,
    userId: number,
  ): Promise<ExaminationEntity> {
    const examination = await this.examinationRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    if (examination.createdBy.id !== userId) {
      throw new ForbiddenException('You can only update your own examinations');
    }

    Object.assign(examination, updateData);
    return this.examinationRepository.save(examination);
  }

  async deleteExamination(id: number, userId: number): Promise<void> {
    const examination = await this.examinationRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    if (examination.createdBy.id !== userId) {
      throw new ForbiddenException('You can only delete your own examinations');
    }

    examination.isActive = false;
    await this.examinationRepository.save(examination);
  }

  async submitExamination(examinationId: number, answers: any[], userId: number): Promise<ExaminationResult> {
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId },
      relations: ['questions'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    let correctAnswers = 0;
    let totalScore = 0;
    const detailedResults = [];

    // Process each answer
    for (const answer of answers) {
      const question = examination.questions.find((q) => q.id === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.userAnswer;
        const pointsEarned = isCorrect ? question.points : 0;

        if (isCorrect) correctAnswers++;
        totalScore += pointsEarned;

        // Save user answer
        const userAnswer = this.answerRepository.create({
          userAnswer: answer.userAnswer,
          isCorrect,
          pointsEarned,
          user: { id: userId } as UserEntity,
          question,
        });
        await this.answerRepository.save(userAnswer);

        detailedResults.push({
          questionId: question.id,
          userAnswer: answer.userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          pointsEarned,
        });
      }
    }

    const totalPossibleScore = examination.questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (totalScore / totalPossibleScore) * 100;
    const isPassed = percentage >= examination.passingScore;

    // Save examination result
    const result = this.resultRepository.create({
      score: totalScore,
      percentage,
      totalQuestions: examination.questions.length,
      correctAnswers,
      timeSpent: answers.length > 0 ? answers[0].timeSpent || 0 : 0,
      isPassed,
      detailedResults,
      user: { id: userId } as UserEntity,
      examination,
    });

    return this.resultRepository.save(result);
  }

  async getUserResults(userId: number): Promise<ExaminationResult[]> {
    return this.resultRepository.find({
      where: { user: { id: userId } },
      relations: ['examination'],
      order: { completedAt: 'DESC' },
    });
  }

  async getExaminationResults(examinationId: number): Promise<ExaminationResult[]> {
    return this.resultRepository.find({
      where: { examination: { id: examinationId } },
      relations: ['user', 'examination'],
      order: { completedAt: 'DESC' },
    });
  }
}
