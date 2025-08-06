import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Question } from '@entities/question.entity';
import { QuestionOption } from '@entities/question-option.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { QuestionBank } from '@entities/question-bank.entity';
import { DifficultyLevel, QuestionMode, QuestionType } from '@common/typings/question-type.enum';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionOption)
    private readonly optionRepository: Repository<QuestionOption>,
    @InjectRepository(QuestionCategory)
    private readonly categoryRepository: Repository<QuestionCategory>,
    @InjectRepository(QuestionBank)
    private readonly bankRepository: Repository<QuestionBank>,
  ) {}

  // src/question/question.service.ts
  async create(createDto: CreateQuestionDto): Promise<Question> {
    // let category: QuestionCategory = null;

    // if (createDto.categoryId) {
    //   category = await this.categoryRepository.findOne({ where: { id: createDto.categoryId } });
    //   if (!category) {
    //     throw new NotFoundException(`Category with ID ${createDto.categoryId} not found`);
    //   }
    // }

    const question = this.questionRepository.create({
      content: createDto.content,
      type: createDto.type,
      mode: createDto.mode,
      difficultyLevel: createDto.difficultyLevel || DifficultyLevel.MEDIUM,
      explanation: createDto.explanation,
      correctAnswer: createDto.correctAnswer,
      audioUrl: createDto.audioUrl,
      // category,
      createdBy: createDto.createdBy, // phải set từ controller
    });

    const createdQuestion = await this.questionRepository.save(question);

    if (createDto.options?.length > 0) {
      const options = createDto.options.map((opt) =>
        this.optionRepository.create({
          content: opt.content,
          isCorrect: opt.isCorrect,
          question: createdQuestion,
        }),
      );
      await this.optionRepository.save(options);
      createdQuestion.options = options;
    }

    return createdQuestion;
  }

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({
      relations: ['options'],
    });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['options'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }
  async update(id: number, updateDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['options'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Update main fields
    Object.assign(question, {
      content: updateDto.content,
      type: updateDto.type,
      mode: updateDto.mode,
      explanation: updateDto.explanation,
      correctAnswer: updateDto.correctAnswer,
      difficultyLevel: updateDto.difficultyLevel || question.difficultyLevel,
      audioUrl: updateDto.audioUrl,
    });

    const updatedQuestion = await this.questionRepository.save(question);

    // Remove old options
    await this.optionRepository.delete({ question: { id: question.id } });

    // Add new options
    if (updateDto.options?.length > 0) {
      const newOptions = updateDto.options.map((opt) =>
        this.optionRepository.create({
          content: opt.content,
          isCorrect: opt.isCorrect,
          question,
        }),
      );
      await this.optionRepository.save(newOptions);
      updatedQuestion.options = newOptions;
    } else {
      updatedQuestion.options = [];
    }

    return updatedQuestion;
  }

  async remove(id: number): Promise<void> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    await this.optionRepository.delete({ question: { id } });
    await this.questionRepository.delete(id);
  }
}
