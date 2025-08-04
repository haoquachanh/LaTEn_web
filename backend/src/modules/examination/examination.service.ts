import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Examination } from '@entities/examination.entity';
import { Question, QuestionType, QuestionMode } from '@entities/question.entity';
import { QuestionOption } from '@entities/question-option.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationAnswer } from '@entities/examination-answer.entity';
import { UserEntity } from '@entities/user.entity';
import { CreateExaminationDto, UpdateExaminationDto, PresetExaminationDto } from './dtos/examination.dto';
import { SubmitExaminationDto } from './dtos/submit-examination.dto';
import { StartExaminationDto } from './dtos/start-examination.dto';

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

  async getPresetExaminations(): Promise<Examination[]> {
    const query = this.examinationRepository
      .createQueryBuilder('examination')
      .leftJoinAndSelect('examination.user', 'user')
      .where('examination.isPreset = :isPreset', { isPreset: true })
      .orderBy('examination.createdAt', 'DESC');

    return query.getMany();
  }

  async getUserResults(userId: number, page: number = 1, limit: number = 10) {
    const queryBuilder = this.examinationRepository
      .createQueryBuilder('examination')
      .leftJoinAndSelect('examination.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('examination.completedAt IS NOT NULL')
      .orderBy('examination.completedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [results, total] = await queryBuilder.getManyAndCount();

    return {
      results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getExaminationResults(examinationId: number, page: number = 1, limit: number = 10) {
    // This endpoint is for teachers/admins to see all results for a specific preset examination
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId, isPreset: true },
    });

    if (!examination) {
      throw new NotFoundException('Preset examination not found');
    }

    const query = this.examinationRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.user', 'user')
      .where('exam.presetExaminationId = :id', { id: examinationId })
      .andWhere('exam.completedAt IS NOT NULL');

    const total = await query.getCount();
    const results = await query
      .orderBy('exam.score', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getResultById(resultId: number, userId: number) {
    const result = await this.examinationRepository.findOne({
      where: { id: resultId },
      relations: [
        'user',
        'examinationQuestions',
        'examinationQuestions.question',
        'examinationQuestions.question.options',
        'examinationQuestions.answers',
      ],
    });

    if (!result) {
      throw new NotFoundException('Examination result not found');
    }

    // Check if this is the user's own result or they're an admin/teacher
    if (result.user.id !== userId && !result.isPreset) {
      throw new ForbiddenException('You do not have permission to view this result');
    }

    return result;
  }

  async getExaminationsByType(type: QuestionType, page: number = 1, limit: number = 10) {
    const [examinations, total] = await this.examinationRepository.findAndCount({
      where: { questionType: type, isPreset: true },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      examinations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getExaminationsByLevel(level: string, page: number = 1, limit: number = 10) {
    const queryBuilder = this.examinationRepository
      .createQueryBuilder('examination')
      .leftJoinAndSelect('examination.user', 'user')
      .where('examination.difficultyLevel = :level', { level })
      .andWhere('examination.isPreset = :isPreset', { isPreset: true })
      .orderBy('examination.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [examinations, total] = await queryBuilder.getManyAndCount();

    return {
      examinations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getExaminationById(id: number, userId: number): Promise<Examination> {
    const examination = await this.examinationRepository.findOne({
      where: { id },
      relations: [
        'user',
        'examinationQuestions',
        'examinationQuestions.question',
        'examinationQuestions.question.options',
        'examinationQuestions.answers',
      ],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    // If this is not a preset exam and doesn't belong to the user, deny access
    if (!examination.isPreset && examination.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to view this examination');
    }

    return examination;
  }

  async getAllExaminations(page: number = 1, limit: number = 10, type?: QuestionType, mode?: QuestionMode) {
    const query = this.examinationRepository
      .createQueryBuilder('examination')
      .leftJoinAndSelect('examination.user', 'user')
      .where('examination.isPreset = :isPreset', { isPreset: true });

    if (type) {
      query.andWhere('examination.questionType = :type', { type });
    }

    if (mode) {
      query.andWhere('examination.mode = :mode', { mode });
    }

    const total = await query.getCount();
    const examinations = await query
      .orderBy('examination.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      examinations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async startExamination(
    examinationId: number, 
    userId: number, 
    startExamDto?: StartExaminationDto
  ): Promise<Examination> {
    // Check if this is a preset examination
    const presetExam = await this.examinationRepository.findOne({
      where: { id: examinationId, isPreset: true },
      relations: ['examinationQuestions', 'examinationQuestions.question'],
    });

    if (!presetExam) {
      throw new NotFoundException('Preset examination not found');
    }

    console.log('Starting examination with custom parameters:', startExamDto);

    // Create new examination instance for this user using preset values or custom values
    const examination = new Examination();
    examination.user = { id: userId } as UserEntity;
    examination.questionType = startExamDto?.type !== undefined ? startExamDto.type : presetExam.questionType;
    examination.mode = startExamDto?.content !== undefined ? startExamDto.content : presetExam.mode;
    examination.totalQuestions = startExamDto?.questionsCount || presetExam.totalQuestions;
    examination.durationSeconds = startExamDto?.duration ? startExamDto.duration * 60 : presetExam.durationSeconds;
    examination.startedAt = new Date();
    examination.correctAnswers = 0;
    examination.presetExaminationId = presetExam.id;
    examination.difficultyLevel = startExamDto?.level !== undefined ? startExamDto.level : presetExam.difficultyLevel;
    examination.title = presetExam.title;
    
    const savedExamination = await this.examinationRepository.save(examination);

    // Get questions based on custom criteria if provided, otherwise use preset questions
    let questionsToUse = [];
    
    if (startExamDto && (startExamDto.questionsCount !== undefined || startExamDto.type !== undefined || startExamDto.level !== undefined || startExamDto.content !== undefined)) {
      // Query questions based on custom criteria
      console.log('Fetching questions with custom criteria');
      
      const queryBuilder = this.questionRepository
        .createQueryBuilder('question')
        .where('1 = 1'); // Always true condition to start

      if (startExamDto.type !== undefined) {
        queryBuilder.andWhere('question.type = :type', { type: startExamDto.type });
      }

      if (startExamDto.content !== undefined) {
        queryBuilder.andWhere('question.mode = :mode', { mode: startExamDto.content });
      }

      if (startExamDto.level !== undefined) {
        queryBuilder.andWhere('question.difficultyLevel = :level', { level: startExamDto.level });
      }

      const limit = startExamDto.questionsCount || presetExam.totalQuestions;
      questionsToUse = await queryBuilder.orderBy('RAND()').limit(limit).getMany();
      
      console.log(`Found ${questionsToUse.length} questions with custom criteria`);
    } else {
      // Use preset examination questions
      console.log('Using preset examination questions');
      questionsToUse = presetExam.examinationQuestions.map(eq => eq.question);
    }

    // Add questions to examination
    for (const question of questionsToUse) {
      const examQuestion = new ExaminationQuestion();
      examQuestion.examination = savedExamination;
      examQuestion.question = question;
      await this.examinationQuestionRepository.save(examQuestion);
    }

    // Return examination with questions
    return this.getExaminationWithQuestions(savedExamination.id);
  }

  async createExamination(createExaminationDto: CreateExaminationDto): Promise<Examination> {
    // Get questions based on provided IDs or generate random ones
    let questions: Question[] = [];

    if (createExaminationDto.questionIds && createExaminationDto.questionIds.length > 0) {
      // Use specified questions
      const ids = createExaminationDto.questionIds;
      questions = await this.questionRepository.findBy({ id: In(ids) });

      if (questions.length !== createExaminationDto.questionIds.length) {
        throw new BadRequestException('Some question IDs are invalid');
      }
    } else {
      // Generate random questions
      const queryBuilder = this.questionRepository
        .createQueryBuilder('question')
        .where('question.type = :type', { type: createExaminationDto.questionType })
        .andWhere('question.mode = :mode', { mode: createExaminationDto.mode });

      if (createExaminationDto.difficultyLevel) {
        queryBuilder.andWhere('question.difficultyLevel = :level', { level: createExaminationDto.difficultyLevel });
      }

      questions = await queryBuilder.orderBy('RAND()').limit(createExaminationDto.totalQuestions).getMany();
    }

    if (questions.length < createExaminationDto.totalQuestions) {
      throw new BadRequestException(
        `Not enough questions available for the specified criteria. Found: ${questions.length}, Required: ${createExaminationDto.totalQuestions}`,
      );
    }

    // Create preset examination
    const examination = this.examinationRepository.create({
      title: createExaminationDto.title,
      description: createExaminationDto.description,
      questionType: createExaminationDto.questionType,
      mode: createExaminationDto.mode,
      totalQuestions: createExaminationDto.totalQuestions,
      durationSeconds: createExaminationDto.durationSeconds,
      isPreset: true,
      difficultyLevel: createExaminationDto.difficultyLevel,
      startedAt: new Date(), // For consistency, though not really used for presets
    });

    const savedExamination = await this.examinationRepository.save(examination);

    // Create examination questions
    for (const question of questions) {
      const examQuestion = this.examinationQuestionRepository.create({
        examination: savedExamination,
        question,
      });
      await this.examinationQuestionRepository.save(examQuestion);
    }

    return this.getExaminationById(savedExamination.id, null);
  }

  async updateExamination(id: number, updateExaminationDto: UpdateExaminationDto): Promise<Examination> {
    const examination = await this.examinationRepository.findOne({
      where: { id, isPreset: true },
    });

    if (!examination) {
      throw new NotFoundException('Preset examination not found');
    }

    // Update basic properties
    if (updateExaminationDto.title) examination.title = updateExaminationDto.title;
    if (updateExaminationDto.description) examination.description = updateExaminationDto.description;
    if (updateExaminationDto.difficultyLevel) examination.difficultyLevel = updateExaminationDto.difficultyLevel;
    if (updateExaminationDto.durationSeconds) examination.durationSeconds = updateExaminationDto.durationSeconds;

    // Handle question updates if provided
    if (updateExaminationDto.questionIds && updateExaminationDto.questionIds.length > 0) {
      // Delete existing examination questions
      await this.examinationQuestionRepository.delete({ examination: { id } });

      // Add new questions
      const ids = updateExaminationDto.questionIds;
      const questions = await this.questionRepository.findBy({ id: In(ids) });

      if (questions.length !== updateExaminationDto.questionIds.length) {
        throw new BadRequestException('Some question IDs are invalid');
      }

      for (const question of questions) {
        const examQuestion = this.examinationQuestionRepository.create({
          examination,
          question,
        });
        await this.examinationQuestionRepository.save(examQuestion);
      }

      // Update total questions count
      examination.totalQuestions = questions.length;
    }

    await this.examinationRepository.save(examination);
    return this.getExaminationById(id, null);
  }

  async deleteExamination(id: number): Promise<void> {
    const examination = await this.examinationRepository.findOne({
      where: { id, isPreset: true },
    });

    if (!examination) {
      throw new NotFoundException('Preset examination not found');
    }

    // Delete related examination questions
    await this.examinationQuestionRepository.delete({ examination: { id } });

    await this.examinationRepository.remove(examination);
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

  async submitExamination(
    examinationId: number,
    submitData: SubmitExaminationDto,
    userId: number,
  ): Promise<Examination> {
    // Find examination
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId, user: { id: userId } },
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

  // Delete method moved above
}
