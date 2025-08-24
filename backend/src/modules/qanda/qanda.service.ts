import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QandAQuestion } from '../../entities/qanda-question.entity';
import { QandAAnswer } from '../../entities/qanda-answer.entity';
import { PostTag } from '../../entities/post-tag.entity';
import { UserEntity } from '../../entities/user.entity';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { GetQuestionsDto } from './dtos/get-questions.dto';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';
import { QuestionResponse, QuestionDetailResponse, AnswerResponse } from './interfaces/question-response.interface';
import { UserRole } from '../../common/typings/user-role.enum';

@Injectable()
export class QandAService {
  constructor(
    @InjectRepository(QandAQuestion)
    private questionRepository: Repository<QandAQuestion>,
    @InjectRepository(QandAAnswer)
    private answerRepository: Repository<QandAAnswer>,
    @InjectRepository(PostTag)
    private tagRepository: Repository<PostTag>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // Helper to check if user is teacher/admin
  private async isTeacherOrAdmin(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user && (user.role === UserRole.ADMIN || user.role === UserRole.ROOT || user.role === UserRole.TEACHER);
  }

  // Helper to check if user can view question
  private async canViewQuestion(question: QandAQuestion, userId: number): Promise<boolean> {
    // Owner can always view
    if (question.userId === userId) {
      return true;
    }
    // Teachers and admins can view all questions
    return this.isTeacherOrAdmin(userId);
  }

  // Students can only create questions, teachers/admins can answer
  async createQuestion(userId: number, createQuestionDto: CreateQuestionDto): Promise<QuestionResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const question = this.questionRepository.create({
      ...createQuestionDto,
      userId,
      author: user,
      isActive: true,
    });

    if (createQuestionDto.tagIds && createQuestionDto.tagIds.length > 0) {
      const tags = await this.tagRepository.findByIds(createQuestionDto.tagIds);
      question.tags = tags;
    }

    await this.questionRepository.save(question);
    return this.formatQuestionResponse(question);
  }

  // Get questions based on user role:
  // - Students: only see their own questions
  // - Teachers/Admin: see all questions
  async getAllQuestions(queryParams: GetQuestionsDto, userId: number): Promise<PaginatedResponse<QuestionResponse>> {
    const { page = 1, limit = 10, category, tagId, search, status } = queryParams;
    const skip = (page - 1) * limit;

    const isTeacher = await this.isTeacherOrAdmin(userId);

    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.author', 'author')
      .leftJoinAndSelect('question.tags', 'tags')
      .where('question.isActive = :isActive', { isActive: true });

    // Students only see their own questions
    if (!isTeacher) {
      query.andWhere('question.userId = :userId', { userId });
    }

    if (category) {
      query.andWhere('question.category = :category', { category });
    }

    if (tagId) {
      query.andWhere('tags.id = :tagId', { tagId });
    }

    if (search) {
      query.andWhere('(question.title LIKE :search OR question.content LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (status === 'answered') {
      query.andWhere('question.isAnswered = :isAnswered', { isAnswered: true });
    } else if (status === 'unanswered') {
      query.andWhere('question.isAnswered = :isAnswered', { isAnswered: false });
    }

    const total = await query.getCount();
    const questions = await query.orderBy('question.createdAt', 'DESC').skip(skip).take(limit).getMany();

    const questionsWithCounts = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await this.answerRepository.count({
          where: { questionId: question.id, isActive: true },
        });

        // Get first answer (earliest teacher response)
        let topAnswer = null;
        if (question.acceptedAnswerId) {
          topAnswer = await this.answerRepository.findOne({
            where: { id: question.acceptedAnswerId, isActive: true },
            relations: ['author'],
          });
        } else {
          topAnswer = await this.answerRepository.findOne({
            where: { questionId: question.id, isActive: true },
            relations: ['author'],
            order: { createdAt: 'ASC' },
          });
        }

        return { ...question, answerCount, topAnswer };
      }),
    );

    const items = questionsWithCounts.map((question) => this.formatQuestionResponse(question));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getQuestionById(id: number, userId: number): Promise<QuestionDetailResponse> {
    const question = await this.questionRepository.findOne({
      where: { id, isActive: true },
      relations: ['author', 'tags'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Check access permission
    const canView = await this.canViewQuestion(question, userId);
    if (!canView) {
      throw new ForbiddenException('You do not have permission to view this question');
    }

    const answers = await this.answerRepository.find({
      where: { questionId: question.id, isActive: true },
      relations: ['author'],
      order: { isAccepted: 'DESC', createdAt: 'ASC' },
    });

    const detailResponse: QuestionDetailResponse = {
      ...this.formatQuestionResponse({ ...question, answerCount: answers.length }),
      answers: answers.map((answer) => this.formatAnswerResponse(answer)),
    };

    return detailResponse;
  }

  async updateQuestion(
    userId: number,
    questionId: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionResponse> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['author', 'tags'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Only owner or admin can update
    if (question.userId !== userId) {
      const isAdmin = await this.isTeacherOrAdmin(userId);
      if (!isAdmin) {
        throw new ForbiddenException('You do not have permission to update this question');
      }
    }

    Object.assign(question, updateQuestionDto);

    if (updateQuestionDto.tagIds) {
      const tags = await this.tagRepository.findByIds(updateQuestionDto.tagIds);
      question.tags = tags;
    }

    await this.questionRepository.save(question);
    return this.formatQuestionResponse(question);
  }

  async deleteQuestion(userId: number, questionId: number): Promise<void> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['author'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Only owner or admin can delete
    if (question.userId !== userId) {
      const isAdmin = await this.isTeacherOrAdmin(userId);
      if (!isAdmin) {
        throw new ForbiddenException('You do not have permission to delete this question');
      }
    }

    question.isActive = false;
    await this.questionRepository.save(question);
  }

  // Only teachers/admin can answer
  async addAnswer(userId: number, questionId: number, createAnswerDto: CreateAnswerDto): Promise<AnswerResponse> {
    const isTeacher = await this.isTeacherOrAdmin(userId);
    if (!isTeacher) {
      throw new ForbiddenException('Only teachers and admins can answer questions');
    }

    const question = await this.questionRepository.findOne({
      where: { id: questionId, isActive: true },
      relations: ['author'],
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const answer = this.answerRepository.create({
      ...createAnswerDto,
      questionId,
      userId,
      author: user,
      isActive: true,
    });

    await this.answerRepository.save(answer);

    // Update question as answered
    if (!question.isAnswered) {
      question.isAnswered = true;
      await this.questionRepository.save(question);
    }

    return this.formatAnswerResponse(answer);
  }

  // Only question owner can accept answer
  async acceptAnswer(userId: number, answerId: number): Promise<AnswerResponse> {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId, isActive: true },
      relations: ['question', 'author'],
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    // Only question owner can accept answer
    if (answer.question.userId !== userId) {
      throw new ForbiddenException('Only the question owner can accept an answer');
    }

    // Unaccept previous answer if exists
    if (answer.question.acceptedAnswerId) {
      const prevAnswer = await this.answerRepository.findOne({
        where: { id: answer.question.acceptedAnswerId },
      });
      if (prevAnswer) {
        prevAnswer.isAccepted = false;
        await this.answerRepository.save(prevAnswer);
      }
    }

    answer.isAccepted = true;
    await this.answerRepository.save(answer);

    answer.question.acceptedAnswerId = answer.id;
    await this.questionRepository.save(answer.question);

    return this.formatAnswerResponse(answer);
  }

  async updateAnswer(userId: number, answerId: number, updateAnswerDto: UpdateAnswerDto): Promise<AnswerResponse> {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId, isActive: true },
      relations: ['author'],
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    // Only answer author or admin can update
    if (answer.userId !== userId) {
      const isAdmin = await this.isTeacherOrAdmin(userId);
      if (!isAdmin) {
        throw new ForbiddenException('You do not have permission to update this answer');
      }
    }

    Object.assign(answer, updateAnswerDto);
    await this.answerRepository.save(answer);

    return this.formatAnswerResponse(answer);
  }

  async deleteAnswer(userId: number, answerId: number): Promise<void> {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['author', 'question'],
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    // Only answer author or admin can delete
    if (answer.userId !== userId) {
      const isAdmin = await this.isTeacherOrAdmin(userId);
      if (!isAdmin) {
        throw new ForbiddenException('You do not have permission to delete this answer');
      }
    }

    answer.isActive = false;
    await this.answerRepository.save(answer);

    // Check if question still has answers
    const remainingAnswers = await this.answerRepository.count({
      where: { questionId: answer.question.id, isActive: true },
    });

    if (remainingAnswers === 0) {
      answer.question.isAnswered = false;
      answer.question.acceptedAnswerId = null;
      await this.questionRepository.save(answer.question);
    } else if (answer.isAccepted) {
      answer.question.acceptedAnswerId = null;
      await this.questionRepository.save(answer.question);
    }
  }

  // Helper methods
  private formatQuestionResponse(question: any): QuestionResponse {
    return {
      id: question.id,
      title: question.title,
      content: question.content,
      category: question.category,
      isAnswered: question.isAnswered,
      acceptedAnswerId: question.acceptedAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: {
        id: question.author.id,
        fullname: question.author.fullname,
        username: question.author.username,
        email: question.author.email,
      },
      tags:
        question.tags?.map((tag) => ({
          id: tag.id,
          name: tag.name,
        })) || [],
      answerCount: question.answerCount || 0,
      topAnswer: question.topAnswer ? this.formatAnswerResponse(question.topAnswer) : null,
    };
  }

  private formatAnswerResponse(answer: any): AnswerResponse {
    return {
      id: answer.id,
      content: answer.content,
      isAccepted: answer.isAccepted,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
      author: {
        id: answer.author.id,
        fullname: answer.author.fullname,
        username: answer.author.username,
        email: answer.author.email,
      },
    };
  }
}
