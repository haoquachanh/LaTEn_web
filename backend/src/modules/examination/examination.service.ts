import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Examination } from '@entities/examination.entity';
import { Question, QuestionType, QuestionMode } from '@entities/question.entity';
import { QuestionOption } from '@entities/question-option.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationAnswer } from '@entities/examination-answer.entity';
import { UserEntity } from '@entities/user.entity';
import { CreateExaminationDto, SubmitExaminationDto } from './dtos/examination.dto';

@Injectable()
export class ExaminationService {
  constructor(
    @InjectRepository(Examination)
    private readonly examinationRepository: Repository<Examination>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private readonly optionRepository: Repository<QuestionOption>,
    @InjectRepository(ExaminationQuestion)
    private readonly examinationQuestionRepository: Repository<ExaminationQuestion>,
    @InjectRepository(ExaminationAnswer)
    private readonly examinationAnswerRepository: Repository<ExaminationAnswer>,
  ) {}

  async getUserExaminations(userId: number): Promise<Examination[]> {
    return this.examinationRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { startedAt: 'DESC' },
    });
  }

  async getExaminationById(id: number, userId: number): Promise<Examination> {
    const examination = await this.examinationRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'examinationQuestions', 'examinationQuestions.question', 'examinationQuestions.answers'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    return examination;
  }

  async getExaminations(type?: QuestionType, mode?: QuestionMode): Promise<Examination[]> {
    const query = this.examinationRepository
      .createQueryBuilder('examination')
      .leftJoinAndSelect('examination.user', 'user')
      .orderBy('examination.startedAt', 'DESC');

    if (type) {
      query.andWhere('examination.questionType = :type', { type });
    }

    if (mode) {
      query.andWhere('examination.mode = :mode', { mode });
    }

    return query.getMany();
  }

  async startExamination(examData: CreateExaminationDto, user: UserEntity): Promise<Examination> {
    // Create new examination
    const examination = this.examinationRepository.create({
      user,
      questionType: examData.questionType,
      mode: examData.mode,
      totalQuestions: examData.totalQuestions,
      durationSeconds: examData.durationSeconds,
      startedAt: new Date(),
      correctAnswers: 0,
    });

    const savedExamination = await this.examinationRepository.save(examination);

    // Get random questions based on type and mode
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .where('question.type = :type', { type: examData.questionType })
      .andWhere('question.mode = :mode', { mode: examData.mode })
      .orderBy('RAND()')
      .limit(examData.totalQuestions)
      .getMany();

    // Create examination questions
    for (const question of questions) {
      const examQuestion = this.examinationQuestionRepository.create({
        examination: savedExamination,
        question,
      });
      await this.examinationQuestionRepository.save(examQuestion);
    }

    // Return examination with questions
    return this.getExaminationWithQuestions(savedExamination.id);
  }

  async getExaminationWithQuestions(examinationId: number): Promise<Examination> {
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId },
      relations: ['user'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    const examQuestions = await this.examinationQuestionRepository.find({
      where: { examination: { id: examinationId } },
      relations: ['question', 'question.options'],
    });

    // Hide correct answers from the response
    for (const examQuestion of examQuestions) {
      if (examQuestion.question.options) {
        for (const option of examQuestion.question.options) {
          delete option.isCorrect;
        }
      }
    }

    examination['questions'] = examQuestions.map((eq) => ({
      id: eq.id,
      question: eq.question,
    }));

    return examination;
  }

  async submitExamination(submitData: SubmitExaminationDto, userId: number): Promise<Examination> {
    // Find examination
    const examination = await this.examinationRepository.findOne({
      where: { id: submitData.examinationId, user: { id: userId } },
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    let correctAnswers = 0;

    // Process each answer
    for (const answer of submitData.answers) {
      const examQuestion = await this.examinationQuestionRepository.findOne({
        where: { id: answer.questionId, examination: { id: examination.id } },
        relations: ['question'],
      });

      if (!examQuestion) {
        continue;
      }

      let isCorrect = false;
      const examAnswer = this.examinationAnswerRepository.create({
        examinationQuestion: examQuestion,
      });

      if (examQuestion.question.type === QuestionType.MULTIPLE_CHOICE) {
        if (answer.selectedOptionId) {
          const option = await this.optionRepository.findOne({
            where: { id: answer.selectedOptionId, question: { id: examQuestion.question.id } },
          });

          if (option) {
            examAnswer.selectedOption = option;
            isCorrect = option.isCorrect;
          }
        }
      } else if (examQuestion.question.type === QuestionType.TRUE_FALSE) {
        if (answer.selectedOptionId) {
          const option = await this.optionRepository.findOne({
            where: { id: answer.selectedOptionId, question: { id: examQuestion.question.id } },
          });

          if (option) {
            examAnswer.selectedOption = option;
            isCorrect = option.isCorrect;
          }
        }
      } else if (examQuestion.question.type === QuestionType.SHORT_ANSWER) {
        if (answer.answerText) {
          examAnswer.answerText = answer.answerText;

          // Get correct option to check answer
          const correctOption = await this.optionRepository.findOne({
            where: { question: { id: examQuestion.question.id }, isCorrect: true },
          });

          if (correctOption) {
            // Simple case-insensitive check - this could be made more sophisticated
            isCorrect = answer.answerText.toLowerCase() === correctOption.text.toLowerCase();
          }
        }
      }

      examAnswer.isCorrect = isCorrect;
      await this.examinationAnswerRepository.save(examAnswer);

      if (isCorrect) {
        correctAnswers++;
      }
    }

    // Update examination with results
    examination.correctAnswers = correctAnswers;
    return this.examinationRepository.save(examination);
  }

  async deleteExamination(id: number, userId: number): Promise<void> {
    const examination = await this.examinationRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    await this.examinationRepository.remove(examination);
  }
}
