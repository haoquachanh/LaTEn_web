import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '@entities/question.entity';
import { QuestionOption } from '@entities/question-option.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { QuestionBank } from '@entities/question-bank.entity';
import { UserEntity } from '@entities/user.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { DifficultyLevel, QuestionMode, QuestionType } from '@common/typings/question-type.enum';
import { NotFoundException } from '@nestjs/common';

const mockQuestionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

const mockOptionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockCategoryRepository = () => ({
  findOne: jest.fn(),
});

const mockBankRepository = () => ({
  findOne: jest.fn(),
});

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;
  let optionRepository: Repository<QuestionOption>;
  let categoryRepository: Repository<QuestionCategory>;
  let bankRepository: Repository<QuestionBank>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useFactory: mockQuestionRepository,
        },
        {
          provide: getRepositoryToken(QuestionOption),
          useFactory: mockOptionRepository,
        },
        {
          provide: getRepositoryToken(QuestionCategory),
          useFactory: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(QuestionBank),
          useFactory: mockBankRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepository = module.get(getRepositoryToken(Question));
    optionRepository = module.get(getRepositoryToken(QuestionOption));
    categoryRepository = module.get(getRepositoryToken(QuestionCategory));
    bankRepository = module.get(getRepositoryToken(QuestionBank));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a question without options and return it', async () => {
      const user = new UserEntity();
      user.id = 1;

      const createQuestionDto: CreateQuestionDto = {
        content: 'Test Question',
        type: QuestionType.MULTIPLE_CHOICE,
        mode: QuestionMode.READING,
        createdBy: user,
      };

      const questionEntity = {
        id: 1,
        content: createQuestionDto.content,
        type: createQuestionDto.type,
        mode: createQuestionDto.mode,
        difficultyLevel: DifficultyLevel.MEDIUM,
        createdBy: user,
      };

      (questionRepository.create as jest.Mock).mockReturnValue(questionEntity);
      (questionRepository.save as jest.Mock).mockResolvedValue({ ...questionEntity });

      const result = await service.create(createQuestionDto);

      expect(questionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: createQuestionDto.content,
          type: createQuestionDto.type,
          mode: createQuestionDto.mode,
          difficultyLevel: DifficultyLevel.MEDIUM,
          createdBy: user,
        }),
      );
      expect(questionRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ ...questionEntity });
    });

    it('should create a question with options and return it', async () => {
      const user = new UserEntity();
      user.id = 1;

      const createQuestionDto: CreateQuestionDto = {
        content: 'Test Question with Options',
        type: QuestionType.MULTIPLE_CHOICE,
        mode: QuestionMode.READING,
        difficultyLevel: DifficultyLevel.EASY,
        createdBy: user,
        options: [
          { content: 'Option 1', isCorrect: true },
          { content: 'Option 2', isCorrect: false },
        ],
      };

      const questionEntity = {
        id: 1,
        content: createQuestionDto.content,
        type: createQuestionDto.type,
        mode: createQuestionDto.mode,
        difficultyLevel: createQuestionDto.difficultyLevel,
        createdBy: user,
      };

      const optionsEntities = [
        { id: 1, content: 'Option 1', isCorrect: true, question: questionEntity },
        { id: 2, content: 'Option 2', isCorrect: false, question: questionEntity },
      ];

      (questionRepository.create as jest.Mock).mockReturnValue(questionEntity);
      (questionRepository.save as jest.Mock).mockResolvedValue({ ...questionEntity });

      (optionRepository.create as jest.Mock).mockImplementation((dto) => ({
        id: dto.content === 'Option 1' ? 1 : 2,
        content: dto.content,
        isCorrect: dto.isCorrect,
        question: dto.question,
      }));

      (optionRepository.save as jest.Mock).mockResolvedValue(optionsEntities);

      const result = await service.create(createQuestionDto);

      expect(questionRepository.create).toHaveBeenCalled();
      expect(questionRepository.save).toHaveBeenCalled();
      expect(optionRepository.create).toHaveBeenCalledTimes(2);
      expect(optionRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ ...questionEntity, options: optionsEntities });
    });
  });

  describe('findAll', () => {
    it('should return an array of questions', async () => {
      const questions = [
        {
          id: 1,
          content: 'Question 1',
          type: QuestionType.MULTIPLE_CHOICE,
          options: [],
        },
        {
          id: 2,
          content: 'Question 2',
          type: QuestionType.TRUE_FALSE,
          options: [],
        },
      ];

      (questionRepository.find as jest.Mock).mockResolvedValue(questions);

      const result = await service.findAll();

      expect(questionRepository.find).toHaveBeenCalledWith({
        relations: ['options'],
      });
      expect(result).toEqual(questions);
    });
  });

  describe('findOne', () => {
    it('should return a question when it exists', async () => {
      const question = {
        id: 1,
        content: 'Test Question',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [],
      };

      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);

      const result = await service.findOne(1);

      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['options'],
      });
      expect(result).toEqual(question);
    });

    it('should throw NotFoundException when question does not exist', async () => {
      (questionRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['options'],
      });
    });
  });

  describe('update', () => {
    it('should update a question and return it', async () => {
      const existingQuestion = {
        id: 1,
        content: 'Original Question',
        type: QuestionType.MULTIPLE_CHOICE,
        mode: QuestionMode.READING,
        difficultyLevel: DifficultyLevel.MEDIUM,
        options: [{ id: 1, content: 'Original Option 1', isCorrect: true }],
      };

      const updateDto: UpdateQuestionDto = {
        content: 'Updated Question',
        mode: QuestionMode.LISTENING,
        options: [
          { content: 'New Option 1', isCorrect: false },
          { content: 'New Option 2', isCorrect: true },
        ],
      };

      const updatedQuestion = {
        ...existingQuestion,
        content: updateDto.content,
        mode: updateDto.mode,
      };

      const newOptions = [
        { id: 2, content: 'New Option 1', isCorrect: false, question: updatedQuestion },
        { id: 3, content: 'New Option 2', isCorrect: true, question: updatedQuestion },
      ];

      (questionRepository.findOne as jest.Mock).mockResolvedValue(existingQuestion);
      (questionRepository.save as jest.Mock).mockResolvedValue(updatedQuestion);
      (optionRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      (optionRepository.create as jest.Mock).mockImplementation((dto) => ({
        id: dto.content === 'New Option 1' ? 2 : 3,
        content: dto.content,
        isCorrect: dto.isCorrect,
        question: dto.question,
      }));

      (optionRepository.save as jest.Mock).mockResolvedValue(newOptions);

      const result = await service.update(1, updateDto);

      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['options'],
      });
      expect(optionRepository.delete).toHaveBeenCalledWith({ question: { id: 1 } });
      expect(questionRepository.save).toHaveBeenCalled();
      expect(optionRepository.create).toHaveBeenCalledTimes(2);
      expect(optionRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ ...updatedQuestion, options: newOptions });
    });

    it('should throw NotFoundException when question to update does not exist', async () => {
      (questionRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a question successfully', async () => {
      const question = { id: 1, content: 'Test Question' };

      (questionRepository.findOne as jest.Mock).mockResolvedValue(question);
      (optionRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
      (questionRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(questionRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(optionRepository.delete).toHaveBeenCalledWith({ question: { id: 1 } });
      expect(questionRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when question to remove does not exist', async () => {
      (questionRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
