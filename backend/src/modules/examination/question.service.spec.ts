import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionService } from './question.service';
import { Question, QuestionType, QuestionFormat, DifficultyLevel } from '../../entities/question.entity';
import { QuestionCategory } from '../../entities/question-category.entity';
import { QuestionBank } from '../../entities/question-bank.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;
  let categoryRepository: Repository<QuestionCategory>;
  let bankRepository: Repository<QuestionBank>;

  const mockQuestion = {
    id: 1,
    content: 'What is the meaning of "amor"?',
    type: QuestionType.MULTIPLE_CHOICE,
    format: QuestionFormat.READING,
    difficulty: DifficultyLevel.LEVEL_1,
    options: ['Love', 'War', 'Peace'],
    correctAnswer: 'Love',
    points: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(QuestionCategory),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(QuestionBank),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    categoryRepository = module.get<Repository<QuestionCategory>>(getRepositoryToken(QuestionCategory));
    bankRepository = module.get<Repository<QuestionBank>>(getRepositoryToken(QuestionBank));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createQuestion', () => {
    it('should create a question successfully', async () => {
      const createQuestionDto = {
        content: 'Test question',
        type: QuestionType.MULTIPLE_CHOICE,
        format: QuestionFormat.READING,
        difficulty: DifficultyLevel.LEVEL_1,
        options: ['A', 'B', 'C'],
        correctAnswer: 'A',
      };

      mockRepository.create.mockReturnValue(mockQuestion);
      mockRepository.save.mockResolvedValue(mockQuestion);

      const result = await service.createQuestion(createQuestionDto);

      expect(questionRepository.create).toHaveBeenCalledWith(createQuestionDto);
      expect(questionRepository.save).toHaveBeenCalledWith(mockQuestion);
      expect(result).toEqual(mockQuestion);
    });

    it('should throw BadRequestException for invalid multiple choice question', async () => {
      const invalidDto = {
        content: 'Test question',
        type: QuestionType.MULTIPLE_CHOICE,
        format: QuestionFormat.READING,
        difficulty: DifficultyLevel.LEVEL_1,
        options: ['A'], // Only one option
        correctAnswer: 'A',
      };

      mockRepository.create.mockReturnValue(invalidDto);

      await expect(service.createQuestion(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findQuestionById', () => {
    it('should return a question when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockQuestion);

      const result = await service.findQuestionById(1);

      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category', 'questionBank', 'examination', 'answers'],
      });
      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException when question not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findQuestionById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRandomQuestions', () => {
    it('should return random questions', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockQuestion]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getRandomQuestions(5, QuestionType.MULTIPLE_CHOICE);

      expect(result).toEqual([mockQuestion]);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('question.type = :type', {
        type: QuestionType.MULTIPLE_CHOICE,
      });
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('findAllQuestions', () => {
    it('should return paginated questions', async () => {
      const questions = [mockQuestion];
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([questions, total]);

      const result = await service.findAllQuestions(1, 10);

      expect(result).toEqual({
        questions,
        total,
        totalPages: 1,
      });
    });
  });
});
