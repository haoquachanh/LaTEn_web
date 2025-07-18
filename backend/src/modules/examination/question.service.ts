import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Question, QuestionType, QuestionFormat, DifficultyLevel } from '../../entities/question.entity';
import { QuestionCategory } from '../../entities/question-category.entity';
import { QuestionBank } from '../../entities/question-bank.entity';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { CreateQuestionCategoryDto, UpdateQuestionCategoryDto } from './dtos/question-category.dto';
import { CreateQuestionBankDto, UpdateQuestionBankDto } from './dtos/question-bank.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(QuestionCategory)
    private categoryRepository: Repository<QuestionCategory>,
    @InjectRepository(QuestionBank)
    private bankRepository: Repository<QuestionBank>,
  ) {}

  // Question CRUD operations
  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(createQuestionDto);

    // Validate question type and required fields
    this.validateQuestionData(question);

    return await this.questionRepository.save(question);
  }

  async findAllQuestions(
    page: number = 1,
    limit: number = 10,
    type?: QuestionType,
    format?: QuestionFormat,
    difficulty?: DifficultyLevel,
    categoryId?: number,
    bankId?: number,
  ): Promise<{ questions: Question[]; total: number; totalPages: number }> {
    const where: FindOptionsWhere<Question> = {};

    if (type) where.type = type;
    if (format) where.format = format;
    if (difficulty) where.difficulty = difficulty;
    if (categoryId) where.category = { id: categoryId };
    if (bankId) where.questionBank = { id: bankId };

    const [questions, total] = await this.questionRepository.findAndCount({
      where,
      relations: ['category', 'questionBank', 'examination'],
      order: { order: 'ASC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      questions,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findQuestionById(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['category', 'questionBank', 'examination', 'answers'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findQuestionById(id);

    Object.assign(question, updateQuestionDto);
    this.validateQuestionData(question);

    return await this.questionRepository.save(question);
  }

  async deleteQuestion(id: number): Promise<void> {
    const question = await this.findQuestionById(id);
    await this.questionRepository.remove(question);
  }

  // Question validation
  private validateQuestionData(question: Question): void {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        if (!question.options || question.options.length < 2) {
          throw new BadRequestException('Multiple choice questions must have at least 2 options');
        }
        if (!question.correctAnswer) {
          throw new BadRequestException('Multiple choice questions must have a correct answer');
        }
        break;

      case QuestionType.TRUE_FALSE:
        if (!question.correctAnswer || !['true', 'false'].includes(question.correctAnswer.toLowerCase())) {
          throw new BadRequestException('True/False questions must have "true" or "false" as correct answer');
        }
        break;

      case QuestionType.SHORT_ANSWER:
        if (!question.correctAnswer && (!question.acceptableAnswers || question.acceptableAnswers.length === 0)) {
          throw new BadRequestException('Short answer questions must have correct answer or acceptable answers');
        }
        break;

      case QuestionType.ESSAY:
        // Essays don't require predefined correct answers
        break;
    }

    if (question.format === QuestionFormat.LISTENING && !question.audioUrl) {
      throw new BadRequestException('Listening questions must have an audio URL');
    }
  }

  // Question Categories
  async createCategory(createCategoryDto: CreateQuestionCategoryDto): Promise<QuestionCategory> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<QuestionCategory[]> {
    return await this.categoryRepository.find({
      where: { isActive: true },
      relations: ['questions'],
      order: { name: 'ASC' },
    });
  }

  async findCategoryById(id: number): Promise<QuestionCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['questions'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async updateCategory(id: number, updateCategoryDto: UpdateQuestionCategoryDto): Promise<QuestionCategory> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoryRepository.remove(category);
  }

  // Question Banks
  async createBank(createBankDto: CreateQuestionBankDto, creatorId: number): Promise<QuestionBank> {
    const bank = this.bankRepository.create({
      ...createBankDto,
      creator: { id: creatorId },
    });
    return await this.bankRepository.save(bank);
  }

  async findAllBanks(
    page: number = 1,
    limit: number = 10,
    isPublic?: boolean,
    creatorId?: number,
  ): Promise<{ banks: QuestionBank[]; total: number; totalPages: number }> {
    const where: FindOptionsWhere<QuestionBank> = { isActive: true };

    if (isPublic !== undefined) where.isPublic = isPublic;
    if (creatorId) where.creator = { id: creatorId };

    const [banks, total] = await this.bankRepository.findAndCount({
      where,
      relations: ['creator', 'category', 'questions'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      banks,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBankById(id: number): Promise<QuestionBank> {
    const bank = await this.bankRepository.findOne({
      where: { id },
      relations: ['creator', 'category', 'questions'],
    });

    if (!bank) {
      throw new NotFoundException(`Question bank with ID ${id} not found`);
    }

    return bank;
  }

  async updateBank(id: number, updateBankDto: UpdateQuestionBankDto): Promise<QuestionBank> {
    const bank = await this.findBankById(id);
    Object.assign(bank, updateBankDto);
    return await this.bankRepository.save(bank);
  }

  async deleteBank(id: number): Promise<void> {
    const bank = await this.findBankById(id);
    await this.bankRepository.remove(bank);
  }

  // Helper methods
  async getQuestionsByDifficulty(difficulty: DifficultyLevel, limit: number = 10): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { difficulty },
      take: limit,
      order: { order: 'ASC' },
      relations: ['category'],
    });
  }

  async getRandomQuestions(
    count: number,
    type?: QuestionType,
    difficulty?: DifficultyLevel,
    format?: QuestionFormat,
  ): Promise<Question[]> {
    const query = this.questionRepository.createQueryBuilder('question');

    if (type) query.andWhere('question.type = :type', { type });
    if (difficulty) query.andWhere('question.difficulty = :difficulty', { difficulty });
    if (format) query.andWhere('question.format = :format', { format });

    query.orderBy('RANDOM()').limit(count);

    return await query.getMany();
  }
}
