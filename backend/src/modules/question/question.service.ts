import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionType, QuestionMode, QuestionFormat, DifficultyLevel } from '@entities/question.entity';
import { QuestionOption } from '@entities/question-option.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { UserEntity } from '@entities/user.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dtos/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private readonly optionRepository: Repository<QuestionOption>,
    @InjectRepository(QuestionCategory)
    private readonly categoryRepository: Repository<QuestionCategory>,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto, user: UserEntity): Promise<Question> {
    // Find category if categoryId is provided
    let category = null;
    if (createQuestionDto.categoryId) {
      category = await this.categoryRepository.findOne({ where: { id: createQuestionDto.categoryId } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${createQuestionDto.categoryId} not found`);
      }
    }

    const question = this.questionRepository.create({
      content: createQuestionDto.content,
      type: createQuestionDto.type,
      mode: createQuestionDto.mode,
      format: createQuestionDto.format || QuestionFormat.READING,
      difficulty: createQuestionDto.difficulty || DifficultyLevel.LEVEL_1,
      audioUrl: createQuestionDto.audioUrl,
      explanation: createQuestionDto.explanation,
      correctAnswer: createQuestionDto.correctAnswer,
      acceptableAnswers: createQuestionDto.acceptableAnswers,
      points: createQuestionDto.points || 1,
      category,
      createdBy: user,
    });

    const savedQuestion = await this.questionRepository.save(question);

    // Create options for multiple choice or true/false questions
    if (createQuestionDto.options && createQuestionDto.options.length > 0) {
      for (const optionDto of createQuestionDto.options) {
        const option = this.optionRepository.create({
          question: savedQuestion,
          text: optionDto.text,
          isCorrect: optionDto.isCorrect,
        });
        await this.optionRepository.save(option);
      }
    }

    return this.findQuestionById(savedQuestion.id);
  }

  async findAllQuestions(
    page: number = 1,
    limit: number = 10,
    type?: QuestionType,
    mode?: QuestionMode,
  ): Promise<{ items: Question[]; total: number; page: number; limit: number }> {
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .leftJoinAndSelect('question.createdBy', 'user')
      .leftJoinAndSelect('question.category', 'category')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('question.createdAt', 'DESC');

    if (type) {
      query.andWhere('question.type = :type', { type });
    }

    if (mode) {
      query.andWhere('question.mode = :mode', { mode });
    }

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async getRandomQuestions(count: number, type?: QuestionType, mode?: QuestionMode): Promise<Question[]> {
    const query = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'options')
      .leftJoinAndSelect('question.category', 'category')
      .orderBy('RAND()')
      .take(count);

    if (type) {
      query.andWhere('question.type = :type', { type });
    }

    if (mode) {
      query.andWhere('question.mode = :mode', { mode });
    }

    return query.getMany();
  }

  async findQuestionById(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['options', 'createdBy', 'category'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto, user: UserEntity): Promise<Question> {
    const question = await this.findQuestionById(id);

    // Find category if categoryId is provided
    if (updateQuestionDto.categoryId !== undefined) {
      const category = await this.categoryRepository.findOne({ where: { id: updateQuestionDto.categoryId } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${updateQuestionDto.categoryId} not found`);
      }
      question.category = category;
    }

    // Update question properties
    if (updateQuestionDto.content !== undefined) {
      question.content = updateQuestionDto.content;
    }
    if (updateQuestionDto.type !== undefined) {
      question.type = updateQuestionDto.type;
    }
    if (updateQuestionDto.mode !== undefined) {
      question.mode = updateQuestionDto.mode;
    }
    if (updateQuestionDto.format !== undefined) {
      question.format = updateQuestionDto.format;
    }
    if (updateQuestionDto.difficulty !== undefined) {
      question.difficulty = updateQuestionDto.difficulty;
    }
    if (updateQuestionDto.audioUrl !== undefined) {
      question.audioUrl = updateQuestionDto.audioUrl;
    }
    if (updateQuestionDto.explanation !== undefined) {
      question.explanation = updateQuestionDto.explanation;
    }
    if (updateQuestionDto.correctAnswer !== undefined) {
      question.correctAnswer = updateQuestionDto.correctAnswer;
    }
    if (updateQuestionDto.acceptableAnswers !== undefined) {
      question.acceptableAnswers = updateQuestionDto.acceptableAnswers;
    }
    if (updateQuestionDto.points !== undefined) {
      question.points = updateQuestionDto.points;
    }

    await this.questionRepository.save(question);

    // Update options if provided
    if (updateQuestionDto.options && updateQuestionDto.options.length > 0) {
      // Remove existing options
      await this.optionRepository.delete({ question: { id } });

      // Add new options
      for (const optionDto of updateQuestionDto.options) {
        const option = this.optionRepository.create({
          question,
          text: optionDto.text,
          isCorrect: optionDto.isCorrect,
        });
        await this.optionRepository.save(option);
      }
    }

    return this.findQuestionById(id);
  }

  async deleteQuestion(id: number, user: UserEntity): Promise<void> {
    const question = await this.findQuestionById(id);
    await this.questionRepository.remove(question);
  }
}
