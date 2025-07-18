import { Test, TestingModule } from '@nestjs/testing';
import { ExaminationService } from './examination.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { ExaminationEntity, ExaminationType, ExaminationLevel } from '../../entities/examination.entity';
import { ExaminationResult } from '../../entities/examination-result.entity';
import { Answer } from '../../entities/answer.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ExaminationService', () => {
  let service: ExaminationService;
  let examinationRepository: Repository<ExaminationEntity>;
  let questionRepository: Repository<Question>;
  let answerRepository: Repository<Answer>;
  let resultRepository: Repository<ExaminationResult>;

  const mockExaminationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockQuestionRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockAnswerRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockResultRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockExamination: ExaminationEntity = {
    id: 1,
    title: 'TypeScript Exam',
    description: 'An exam about TypeScript',
    type: ExaminationType.GRAMMAR,
    level: ExaminationLevel.BEGINNER,
    duration: 60,
    totalQuestions: 10,
    passingScore: 70,
    isActive: true,
    questions: [],
    results: [],
    createdBy: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationService,
        {
          provide: getRepositoryToken(ExaminationEntity),
          useValue: mockExaminationRepository,
        },
        {
          provide: getRepositoryToken(Question),
          useValue: mockQuestionRepository,
        },
        {
          provide: getRepositoryToken(Answer),
          useValue: mockAnswerRepository,
        },
        {
          provide: getRepositoryToken(ExaminationResult),
          useValue: mockResultRepository,
        },
      ],
    }).compile();

    service = module.get<ExaminationService>(ExaminationService);
    examinationRepository = module.get<Repository<ExaminationEntity>>(getRepositoryToken(ExaminationEntity));
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
    answerRepository = module.get<Repository<Answer>>(getRepositoryToken(Answer));
    resultRepository = module.get<Repository<ExaminationResult>>(getRepositoryToken(ExaminationResult));

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllExaminations', () => {
    it('should return all examinations', async () => {
      const mockExaminations = [mockExamination];
      mockExaminationRepository.find.mockResolvedValue(mockExaminations);

      const result = await service.getAllExaminations();

      expect(mockExaminationRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        relations: ['createdBy'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockExaminations);
    });
  });

  describe('getExaminationById', () => {
    it('should return examination by id', async () => {
      mockExaminationRepository.findOne.mockResolvedValue(mockExamination);

      const result = await service.getExaminationById(1);

      expect(mockExaminationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
        relations: ['questions', 'createdBy'],
      });
      expect(result).toEqual(mockExamination);
    });

    it('should throw NotFoundException if examination not found', async () => {
      mockExaminationRepository.findOne.mockResolvedValue(null);

      await expect(service.getExaminationById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getExaminationsByType', () => {
    it('should return examinations by type', async () => {
      const mockExaminations = [mockExamination];
      mockExaminationRepository.find.mockResolvedValue(mockExaminations);

      const result = await service.getExaminationsByType(ExaminationType.GRAMMAR);

      expect(mockExaminationRepository.find).toHaveBeenCalledWith({
        where: { type: ExaminationType.GRAMMAR, isActive: true },
        relations: ['createdBy'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockExaminations);
    });
  });

  describe('getExaminationsByLevel', () => {
    it('should return examinations by level', async () => {
      const mockExaminations = [mockExamination];
      mockExaminationRepository.find.mockResolvedValue(mockExaminations);

      const result = await service.getExaminationsByLevel(ExaminationLevel.BEGINNER);

      expect(mockExaminationRepository.find).toHaveBeenCalledWith({
        where: { level: ExaminationLevel.BEGINNER, isActive: true },
        relations: ['createdBy'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockExaminations);
    });
  });

  describe('createExamination', () => {
    const createExaminationDto = {
      title: 'TypeScript Exam',
      description: 'An exam about TypeScript',
      type: ExaminationType.GRAMMAR,
      level: ExaminationLevel.BEGINNER,
      duration: 60,
      totalQuestions: 10,
    };

    it('should create a new examination successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'admin@example.com',
        fullname: 'Admin User',
        role: 'ADMIN',
      } as any;
      mockExaminationRepository.create.mockReturnValue(mockExamination);
      mockExaminationRepository.save.mockResolvedValue(mockExamination);

      const result = await service.createExamination(createExaminationDto, mockUser);

      expect(mockExaminationRepository.create).toHaveBeenCalledWith({
        ...createExaminationDto,
        createdBy: mockUser,
      });
      expect(mockExaminationRepository.save).toHaveBeenCalledWith(mockExamination);
      expect(result).toEqual(mockExamination);
    });
  });

  describe('getUserResults', () => {
    it('should return user results', async () => {
      const mockResults = [
        {
          id: 1,
          userId: 1,
          examinationId: 1,
          score: 85,
          totalQuestions: 10,
          correctAnswers: 8,
          startTime: new Date(),
          endTime: new Date(),
        },
      ];
      mockResultRepository.find.mockResolvedValue(mockResults);

      const result = await service.getUserResults(1);

      expect(mockResultRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['examination'],
        order: { completedAt: 'DESC' },
      });
      expect(result).toEqual(mockResults);
    });
  });
});
