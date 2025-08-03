import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question, QuestionType, QuestionMode } from '../../entities/question.entity';
import { QuestionOption } from '../../entities/question-option.entity';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dtos/create-question.dto';

const mockQuestionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getMany: jest.fn(),
  })),
  remove: jest.fn(),
});

const mockOptionRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;
  let optionRepository: Repository<QuestionOption>;

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
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepository = module.get(getRepositoryToken(Question));
    optionRepository = module.get(getRepositoryToken(QuestionOption));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createQuestion', () => {
    it('should create a question and return it', async () => {
      const createQuestionDto: CreateQuestionDto = {
        content: 'Test Question',
        type: QuestionType.MULTIPLE_CHOICE,
        mode: QuestionMode.READING,
        options: [
          { text: 'Option 1', isCorrect: true },
          { text: 'Option 2', isCorrect: false },
        ],
      };
      const user = new UserEntity();
      const savedQuestion = { id: 1, ...createQuestionDto, createdBy: user };

      (questionRepository.create as jest.Mock).mockReturnValue(savedQuestion);
      (questionRepository.save as jest.Mock).mockResolvedValue(savedQuestion);
      (questionRepository.findOne as jest.Mock).mockResolvedValue({
        ...savedQuestion,
        options: createQuestionDto.options,
      });

      const result = await service.createQuestion(createQuestionDto, user);

      expect(questionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          content: createQuestionDto.content,
          type: createQuestionDto.type,
          mode: createQuestionDto.mode,
          createdBy: user,
        }),
      );
      expect(result).toEqual({
        ...savedQuestion,
        options: createQuestionDto.options,
      });
    });
  });

  // Add more tests for other methods as needed
});
