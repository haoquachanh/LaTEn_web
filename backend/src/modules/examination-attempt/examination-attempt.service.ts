import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationTemplate } from '@entities/examination-template.entity';
import { ExaminationPreset } from '@entities/examination-preset.entity';
import { ExaminationStatus } from '@entities/enums/examination-status.enum';
import { QuestionType, DifficultyLevel } from '@common/typings/question-type.enum';
import { QuestionOption } from '@entities/question-option.entity';
import { Question } from '@entities/question.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { AnswerResponse, ExaminationSummary } from './interfaces/examination.interface';
import { CreateExamTemplateDto } from './dtos/template/create-exam-template.dto';
import { UpdateExamTemplateDto } from './dtos/template/update-exam-template.dto';
import { GetExamTemplatesDto, getSortOrder, ExamTemplateSort } from './dtos/template/get-exam-templates.dto';
import { CreateExamPresetDto } from './dtos/preset/create-exam-preset.dto';
import { UpdateExamPresetDto } from './dtos/preset/update-exam-preset.dto';
import { GetExamPresetsDto, getPresetSortOrder } from './dtos/preset/get-exam-presets.dto';

@Injectable()
export class ExaminationAttemptService {
  constructor(
    @InjectRepository(Examination)
    private readonly examinationRepository: Repository<Examination>,
    @InjectRepository(ExaminationQuestion)
    private readonly examQuestionRepository: Repository<ExaminationQuestion>,
    @InjectRepository(ExaminationTemplate)
    private readonly examTemplateRepository: Repository<ExaminationTemplate>,
    @InjectRepository(ExaminationPreset)
    private readonly examPresetRepository: Repository<ExaminationPreset>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionCategory)
    private readonly categoryRepository: Repository<QuestionCategory>,
  ) {}

  async startExamination(examTemplateId: number, userId: number) {
    // Kiểm tra xem người dùng có bài thi nào đang làm dở không
    const ongoingExam = await this.examinationRepository.findOne({
      where: {
        user: { id: userId },
        status: ExaminationStatus.IN_PROGRESS,
      },
    });

    if (ongoingExam) {
      throw new BadRequestException('You have an ongoing examination. Please complete it before starting a new one');
    }

    // Lấy template dựa vào examTemplateId
    const template = await this.examTemplateRepository.findOne({
      where: {
        id: examTemplateId,
        isActive: true,
      },
    });

    if (!template) {
      throw new NotFoundException(`Examination template with ID ${examTemplateId} not found or inactive`);
    }

    // Tạo một bản ghi examination mới với thông tin từ template
    const newExamination = this.examinationRepository.create({
      user: { id: userId },
      template: { id: examTemplateId }, // Lưu tham chiếu đến template
      startedAt: new Date(),
      status: ExaminationStatus.IN_PROGRESS,
      totalQuestions: template.totalQuestions,
      durationSeconds: template.durationSeconds,
      title: template.title,
      description: template.description,
    });

    await this.examinationRepository.save(newExamination);

    // Lấy câu hỏi từ template
    let questions: Question[] = [];

    if (template.questionIds && template.questionIds.length > 0) {
      // Nếu template đã có danh sách câu hỏi cụ thể
      questions = await this.questionRepository.findByIds(template.questionIds);

      // Nếu có cấu hình randomize, trộn câu hỏi
      if (template.config?.randomize) {
        questions = this.shuffleArray([...questions]);
      }
    } else if (template.config?.categoriesDistribution) {
      // Nếu template có phân phối theo danh mục
      for (const categoryDist of template.config.categoriesDistribution) {
        // Lấy tất cả câu hỏi trong category sử dụng mối quan hệ many-to-many
        const allCategoryQuestions = await this.questionRepository
          .createQueryBuilder('question')
          .innerJoin('question.categories', 'category')
          .where('category.id = :categoryId', { categoryId: categoryDist.categoryId })
          .orderBy('question.id', 'ASC')
          .getMany();

        let categoryQuestions: Question[] = [];

        if (template.config.randomize) {
          // Nếu cần trộn, trộn tất cả và lấy số lượng cần thiết
          categoryQuestions = this.shuffleArray([...allCategoryQuestions]).slice(0, categoryDist.count);
        } else {
          // Nếu không trộn, lấy theo thứ tự đầu tiên
          categoryQuestions = allCategoryQuestions.slice(0, categoryDist.count);
        }

        questions = [...questions, ...categoryQuestions];
      }
    } else {
      // Nếu không có cấu hình đặc biệt, lấy các câu hỏi
      const allQuestions = await this.questionRepository.find();

      // Randomize nếu cần
      let selectedQuestions = allQuestions;
      if (template.config?.randomize || !template.config) {
        selectedQuestions = this.shuffleArray([...allQuestions]);
      }

      // Lấy số lượng cần thiết
      questions = selectedQuestions.slice(0, template.totalQuestions || 10);
    }

    // Tạo examination questions
    const examQuestions = questions.map((question) => {
      return this.examQuestionRepository.create({
        examination: newExamination,
        question: question,
      });
    });

    await this.examQuestionRepository.save(examQuestions);

    // Cập nhật totalQuestions
    newExamination.totalQuestions = examQuestions.length;
    await this.examinationRepository.save(newExamination);

    return this.examinationRepository.findOne({
      where: { id: newExamination.id },
      relations: ['user', 'examinationQuestions', 'examinationQuestions.question'],
    });
  }

  async submitAnswer(examinationId: number, answerDto: SubmitAnswerDto, userId: number): Promise<AnswerResponse> {
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId },
      relations: ['user'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    if (examination.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to submit answers to this examination');
    }

    if (examination.status !== ExaminationStatus.IN_PROGRESS) {
      throw new BadRequestException(`This examination is ${examination.status} and cannot accept answers`);
    }

    // Kiểm tra thời gian làm bài còn không
    const currentTime = new Date();
    const endTime = new Date(examination.startedAt);
    endTime.setSeconds(endTime.getSeconds() + examination.durationSeconds);

    if (currentTime > endTime) {
      // Tự động hoàn thành bài thi nếu hết thời gian
      await this.completeExamination(examinationId, userId);
      throw new BadRequestException(
        'The time for this examination has expired and it has been automatically completed',
      );
    }

    // Tìm câu hỏi tương ứng
    const question = await this.examQuestionRepository.findOne({
      where: {
        examination: { id: examinationId },
        id: answerDto.questionId,
      },
      relations: ['question'],
    });

    if (!question) {
      throw new NotFoundException('Question not found in this examination');
    }

    // Cập nhật câu trả lời
    question.userAnswer =
      typeof answerDto.answer === 'object' ? JSON.stringify(answerDto.answer) : String(answerDto.answer);

    // Kiểm tra đúng sai (logic phụ thuộc vào loại câu hỏi)
    // Cần điều chỉnh theo cấu trúc thực tế của entity Question
    let isCorrect = false;
    let correctAnswer = null;

    // Đảm bảo câu hỏi và các options được load đầy đủ
    if (!question.question.options && question.question.type === QuestionType.MULTIPLE_CHOICE) {
      await this.examQuestionRepository.query('SELECT * FROM question_options WHERE "questionId" = $1', [
        question.question.id,
      ]);
    }

    // Kiểm tra đúng/sai dựa vào loại câu hỏi
    switch (question.question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        // Tìm option đúng
        const correctOption = question.question.options?.find((opt) => opt.isCorrect);
        correctAnswer = correctOption?.content;

        // So sánh với câu trả lời của user (có thể là ID của option hoặc nội dung)
        if (typeof answerDto.answer === 'number') {
          // Nếu user gửi ID của option
          const selectedOption = question.question.options?.find((opt) => opt.id === answerDto.answer);
          isCorrect = selectedOption?.isCorrect || false;
        } else {
          // Nếu user gửi nội dung của option
          isCorrect = correctAnswer === answerDto.answer;
        }
        break;

      case QuestionType.TRUE_FALSE:
        correctAnswer = question.question.correctAnswer;
        isCorrect = correctAnswer === answerDto.answer;
        break;

      case QuestionType.SHORT_ANSWER:
        correctAnswer = question.question.correctAnswer;

        // Đối với câu trả lời ngắn, có thể kiểm tra không phân biệt hoa thường
        if (typeof answerDto.answer === 'string' && typeof correctAnswer === 'string') {
          isCorrect = answerDto.answer.toLowerCase() === correctAnswer.toLowerCase();
        } else {
          isCorrect = answerDto.answer === correctAnswer;
        }
        break;

      case QuestionType.ESSAY:
        // Câu hỏi tự luận sẽ được đánh giá thủ công sau
        correctAnswer = question.question.correctAnswer;
        isCorrect = null;
        break;

      default:
        // Mặc định kiểm tra đơn giản
        correctAnswer = question.question.correctAnswer;
        isCorrect = correctAnswer === answerDto.answer;
    }

    // Cập nhật kết quả
    question.isCorrect = isCorrect;
    question.userAnswer = typeof answerDto.answer === 'string' ? answerDto.answer : JSON.stringify(answerDto.answer);

    // Tính điểm cho câu hỏi
    if (isCorrect === true) {
      question.score = question.question.getPoints();
    } else {
      question.score = 0;
    }

    await this.examQuestionRepository.save(question);

    // Cập nhật số câu trả lời đúng trong bài thi
    await this.updateExaminationScore(examinationId);

    // Trả về kết quả với format phù hợp
    return {
      questionId: question.id,
      isCorrect: question.isCorrect,
      userAnswer: answerDto.answer,
      correctAnswer: correctAnswer,
      explanation: question.question.explanation,
    };
  }

  async completeExamination(examinationId: number, userId: number): Promise<ExaminationSummary> {
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId },
      relations: ['user', 'examinationQuestions', 'template'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    if (examination.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to complete this examination');
    }

    if (examination.status === ExaminationStatus.COMPLETED || examination.status === ExaminationStatus.GRADED) {
      throw new BadRequestException('This examination has already been completed');
    }

    // Cập nhật completedAt và status
    examination.completedAt = new Date();
    examination.status = ExaminationStatus.COMPLETED;

    // Tính toán điểm số cuối cùng
    await this.updateExaminationScore(examinationId);

    // Lưu thay đổi
    const savedExamination = await this.examinationRepository.save(examination);

    // Tính thời gian làm bài
    const startTime = new Date(savedExamination.startedAt).getTime();
    const endTime = new Date(savedExamination.completedAt).getTime();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // Chuyển đổi từ ms sang seconds

    // Trả về kết quả cơ bản (không kèm đáp án chi tiết)
    return {
      id: savedExamination.id,
      title: savedExamination.title,
      totalQuestions: savedExamination.totalQuestions,
      correctAnswers: savedExamination.correctAnswers,
      score: savedExamination.score,
      status: savedExamination.status,
      startedAt: savedExamination.startedAt,
      completedAt: savedExamination.completedAt,
      durationSeconds: savedExamination.durationSeconds,
      timeSpent: timeSpent,
    };
  }

  async getCurrentExamination(userId: number) {
    // Tìm bài thi đang làm dở (status = IN_PROGRESS)
    const examination = await this.examinationRepository.findOne({
      where: {
        user: { id: userId },
        status: ExaminationStatus.IN_PROGRESS,
      },
      relations: ['examinationQuestions', 'examinationQuestions.question'],
    });

    if (!examination) {
      return null;
    }

    // Kiểm tra xem bài thi có hết thời gian không
    const currentTime = new Date();
    const endTime = new Date(examination.startedAt);
    endTime.setSeconds(endTime.getSeconds() + examination.durationSeconds);

    if (currentTime > endTime) {
      // Tự động hoàn thành bài thi nếu hết thời gian
      await this.completeExamination(examination.id, userId);
      throw new BadRequestException('Your examination time has expired and it has been automatically completed');
    }

    // Tính thời gian còn lại
    const remainingSeconds = Math.floor((endTime.getTime() - currentTime.getTime()) / 1000);

    return {
      ...examination,
      remainingSeconds,
    };
  }

  async getUserExaminationHistory(userId: number, page: number, limit: number) {
    const [examinations, total] = await this.examinationRepository.findAndCount({
      where: {
        user: { id: userId },
        status: In([ExaminationStatus.COMPLETED, ExaminationStatus.GRADED]),
      },
      order: { completedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Tính toán một số thông tin thêm như thời gian làm bài
    const enhancedExaminations = examinations.map((exam) => {
      const startTime = new Date(exam.startedAt).getTime();
      const endTime = new Date(exam.completedAt).getTime();
      const timeSpent = Math.floor((endTime - startTime) / 1000); // seconds

      return {
        id: exam.id,
        title: exam.title,
        score: exam.score,
        totalQuestions: exam.totalQuestions,
        correctAnswers: exam.correctAnswers,
        startedAt: exam.startedAt,
        completedAt: exam.completedAt,
        timeSpent,
        status: exam.status,
      };
    });

    return {
      data: enhancedExaminations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getExaminationDetail(examinationId: number, userId: number) {
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId },
      relations: ['user', 'examinationQuestions'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    if (examination.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to view this examination');
    }

    return examination;
  }

  // Helper method to update examination score
  private async updateExaminationScore(examinationId: number) {
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId },
      relations: ['examinationQuestions'],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    // Đếm số câu đúng
    const correctAnswers = examination.examinationQuestions.filter((q) => q.isCorrect).length;

    examination.correctAnswers = correctAnswers;

    // Tính điểm (giả sử thang điểm 10)
    if (examination.totalQuestions > 0) {
      examination.score = (correctAnswers / examination.totalQuestions) * 10;
    }

    await this.examinationRepository.save(examination);
  }

  /**
   * Hàm tính toán số câu hỏi trong một template
   * @param template Exam template object
   * @returns Tổng số câu hỏi
   */

  /**
   * Tính tổng số câu hỏi trong một template
   * @param template Template cần tính số câu hỏi
   * @returns Tổng số câu hỏi
   */
  private calculateTotalQuestions(template: ExaminationTemplate): number {
    if (template.totalQuestions > 0) {
      return template.totalQuestions;
    }

    if (template.questionIds?.length > 0) {
      return template.questionIds.length;
    }

    if (template.config?.categoriesDistribution?.length > 0) {
      return template.config.categoriesDistribution.reduce((sum, cat) => sum + cat.count, 0);
    }

    return 0;
  }

  // Hàm hỗ trợ để trộn ngẫu nhiên một mảng (Fisher-Yates shuffle algorithm)
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Các phương thức liên quan đến ExaminationTemplate

  /**
   * Lấy danh sách các bài thi mẫu (template) với pagination và filtering
   * @param query Query parameters cho filtering và pagination
   * @param userId ID của user hiện tại (có thể null nếu không đăng nhập)
   * @returns Danh sách bài thi mẫu và metadata
   */
  async getExamTemplates(query: GetExamTemplatesDto, userId: number | null) {
    const { page = 1, limit = 10, search, sort = ExamTemplateSort.NEWEST, activeOnly = true } = query;

    const whereCondition: any = {};

    // Chỉ lấy templates đang active nếu activeOnly = true
    if (activeOnly) {
      whereCondition.isActive = true;
    }

    // Tìm kiếm theo title hoặc description
    if (search) {
      whereCondition.title = Like(`%${search}%`);
    }

    // Chuyển đổi sort string thành câu lệnh ORDER BY
    const orderColumn = getSortOrder(sort).split(' ')[0];
    const orderDirection = getSortOrder(sort).split(' ')[1] as 'ASC' | 'DESC';

    const [templates, total] = await this.examTemplateRepository.findAndCount({
      where: whereCondition,
      order: { [orderColumn]: orderDirection },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['createdBy'],
    });

    // Format kết quả phù hợp với frontend
    return {
      data: templates.map((template) => ({
        id: template.id.toString(), // Chuyển sang string cho frontend
        title: template.title,
        description: template.description || '', // Đảm bảo không trả về null
        totalQuestions: template.totalQuestions,
        durationSeconds: template.durationSeconds,
        isActive: template.isActive,
        // Thêm các trường tương thích với UI cũ
        type: 'multiple', // Giá trị mặc định
        questions: template.totalQuestions,
        questionsCount: template.totalQuestions,
        time: Math.ceil(template.durationSeconds / 60), // Chuyển từ giây sang phút
        content: 'reading', // Giá trị mặc định
        config: template.config || {
          randomize: false,
          showCorrectAnswers: true,
          passingScore: 0.7,
        },
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        // Thông tin người tạo
        updatedBy: template.createdBy
          ? {
              id: template.createdBy.id.toString(),
              email: template.createdBy.email,
            }
          : undefined,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getExamTemplateById(id: number) {
    const template = await this.examTemplateRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!template) {
      throw new NotFoundException(`Examination template with ID ${id} not found`);
    }

    // Lấy thêm thông tin về các câu hỏi
    let questions = [];
    if (template.questionIds && template.questionIds.length) {
      questions = await this.questionRepository.findByIds(template.questionIds);
    }

    return {
      ...template,
      questions: questions.map((q) => ({
        id: q.id,
        content: q.content,
        type: q.type,
        difficultyLevel: q.difficultyLevel,
      })),
    };
  }

  async createExamTemplate(data: CreateExamTemplateDto, userId: number) {
    // Kiểm tra questionIds
    if (data.questionIds && data.questionIds.length) {
      const questionCount = await this.questionRepository.count({
        where: { id: In(data.questionIds) },
      });

      if (questionCount !== data.questionIds.length) {
        throw new BadRequestException('Some question IDs are invalid');
      }
    }

    // Chuẩn bị dữ liệu để tạo template
    const createData: any = {
      title: data.title,
      description: data.description,
      type: data.type,
      content: data.content,
      level: data.level,
      totalQuestions: data.totalQuestions,
      durationSeconds: data.durationSeconds,
      questionIds: data.questionIds,
      config: data.config,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    // Xử lý questionFilters và đưa vào cấu trúc config mới
    if (data.questionFilters) {
      // Đảm bảo createData.config tồn tại
      if (!createData.config) {
        createData.config = {};
      }

      // Khởi tạo questionFilters trong config
      createData.config.questionFilters = {};

      if (data.questionFilters.categories) {
        createData.config.questionFilters.categories = data.questionFilters.categories;
      }

      if (data.questionFilters.types) {
        createData.config.questionFilters.types = data.questionFilters.types;
      }

      // Xử lý chuyển đổi difficultyLevels từ string sang enum DifficultyLevel
      if (data.questionFilters.difficultyLevels) {
        createData.config.questionFilters.difficultyLevels = data.questionFilters.difficultyLevels.map((level) => {
          if (typeof level === 'string') {
            // Nếu là chuỗi viết thường, chuyển thành viết hoa để khớp với enum
            const upperLevel = level.toUpperCase();
            return DifficultyLevel[upperLevel as keyof typeof DifficultyLevel] || DifficultyLevel.MEDIUM;
          }
          return level;
        });
      }

      // Loại bỏ questionFilters cũ ra khỏi dữ liệu tạo mới vì đã được chuyển vào config
      delete createData.questionFilters;
    }

    // Thiết lập createdBy
    createData.createdBy = { id: userId };

    try {
      // Tạo entity mới
      const template = new ExaminationTemplate();

      // Gán các thuộc tính từ createData
      Object.assign(template, createData);

      // Lưu vào database
      const savedTemplate = await this.examTemplateRepository.save(template);

      return this.getExamTemplateById(savedTemplate.id);
    } catch (error) {
      console.error('Error creating template:', error);
      throw new BadRequestException(`Failed to create template: ${error.message}`);
    }
  }

  async updateExamTemplate(id: number, data: UpdateExamTemplateDto, userId: number) {
    const template = await this.examTemplateRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!template) {
      throw new NotFoundException(`Examination template with ID ${id} not found`);
    }

    // Kiểm tra quyền - chỉ người tạo và admin có quyền sửa
    // Logic này phụ thuộc vào cách bạn xác định admin
    if (template.createdBy.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this template');
    }

    // Kiểm tra questionIds nếu có
    if (data.questionIds && data.questionIds.length) {
      const questionCount = await this.questionRepository.count({
        where: { id: In(data.questionIds) },
      });

      if (questionCount !== data.questionIds.length) {
        throw new BadRequestException('Some question IDs are invalid');
      }

      // Cập nhật totalQuestions
      template.totalQuestions = data.questionIds.length;
    }

    try {
      // Xử lý questionFilters và đưa vào cấu trúc config mới
      if (data.questionFilters) {
        // Đảm bảo config tồn tại
        if (!template.config) {
          template.config = {};
        }

        // Đảm bảo questionFilters trong config tồn tại
        if (!template.config.questionFilters) {
          template.config.questionFilters = {};
        }

        // Cập nhật categories nếu có
        if (data.questionFilters.categories) {
          template.config.questionFilters.categories = data.questionFilters.categories;
        }

        // Cập nhật types nếu có
        if (data.questionFilters.types) {
          template.config.questionFilters.types = data.questionFilters.types;
        }

        // Xử lý và cập nhật difficultyLevels
        if (data.questionFilters.difficultyLevels) {
          template.config.questionFilters.difficultyLevels = data.questionFilters.difficultyLevels.map((level) => {
            if (typeof level === 'string') {
              // Chuyển đổi string sang enum
              const upperLevel = level.toUpperCase();
              return DifficultyLevel[upperLevel as keyof typeof DifficultyLevel] || DifficultyLevel.MEDIUM;
            }
            return level;
          });
        }

        // Loại bỏ questionFilters khỏi data để tránh ghi đè bằng dữ liệu không xử lý
        const { questionFilters, ...restData } = data;
        // Cập nhật các trường còn lại
        Object.assign(template, restData);
      } else {
        // Nếu không cập nhật questionFilters, cập nhật các trường khác bình thường
        Object.assign(template, data);
      }

      await this.examTemplateRepository.save(template);
      return this.getExamTemplateById(template.id);
    } catch (error) {
      console.error('Error updating template:', error);
      throw new BadRequestException(`Failed to update template: ${error.message}`);
    }
  }

  async deleteExamTemplate(id: number, userId: number) {
    const template = await this.examTemplateRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!template) {
      throw new NotFoundException(`Examination template with ID ${id} not found`);
    }

    // Kiểm tra quyền - chỉ người tạo và admin có quyền xóa
    if (template.createdBy.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this template');
    }

    await this.examTemplateRepository.remove(template);

    return { success: true };
  }

  // ========= EXAMINATION PRESET METHODS =========

  /**
   * Tạo một bài thi preset mới với câu hỏi được chọn trước
   */
  async createExamPreset(data: CreateExamPresetDto, userId: number) {
    // Kiểm tra questionIds
    if (!data.questionIds?.length) {
      throw new BadRequestException('At least one question is required for a preset exam');
    }

    // Kiểm tra questionIds có hợp lệ không
    const questions = await this.questionRepository.findByIds(data.questionIds);
    if (questions.length !== data.questionIds.length) {
      throw new BadRequestException('Some question IDs are invalid');
    }

    // Kiểm tra và lấy các categories nếu có
    let categories = [];
    if (data.categoryIds?.length) {
      categories = await this.categoryRepository.findByIds(data.categoryIds);
      if (categories.length !== data.categoryIds.length) {
        throw new BadRequestException('Some category IDs are invalid');
      }
    }

    try {
      // Tạo preset mới
      const preset = this.examPresetRepository.create({
        title: data.title,
        description: data.description,
        type: data.type,
        content: data.content,
        level: data.level,
        durationSeconds: data.durationSeconds,
        totalQuestions: data.questionIds.length,
        config: data.config || {
          randomize: false,
          showCorrectAnswers: true,
          passingScore: 70,
          resultDisplay: {
            showImmediately: true,
            showCorrectAnswers: true,
            showExplanation: true,
            showScoreBreakdown: true,
          },
          security: {
            preventCopy: false,
            preventTabSwitch: false,
            timeoutWarning: 5,
            shuffleOptions: false,
          },
        },
        isActive: data.isActive !== undefined ? data.isActive : true,
        isPublic: data.isPublic !== undefined ? data.isPublic : false,
        createdBy: { id: userId },
        questions,
        categories,
      });

      await this.examPresetRepository.save(preset);

      return this.getExamPresetById(preset.id);
    } catch (error) {
      console.error('Error creating preset exam:', error);
      throw new BadRequestException(`Failed to create preset exam: ${error.message}`);
    }
  }

  /**
   * Lấy danh sách các bài thi preset theo các tiêu chí lọc
   */
  async getExamPresets(queryParams: GetExamPresetsDto, userId: number) {
    try {
      const { page = 1, limit = 10, search, type, level, isActive, isPublic, sort } = queryParams;
      const skip = (page - 1) * limit;

      // Xây dựng câu truy vấn với các điều kiện lọc
      const queryBuilder = this.examPresetRepository
        .createQueryBuilder('preset')
        .leftJoinAndSelect('preset.questions', 'questions')
        .leftJoinAndSelect('preset.categories', 'categories')
        .leftJoinAndSelect('preset.createdBy', 'createdBy');

      // Điều kiện lọc theo người dùng (chỉ xem được preset của mình hoặc public)
      queryBuilder.where('(preset.createdBy.id = :userId OR preset.isPublic = true)', { userId });

      // Áp dụng các bộ lọc nếu có
      if (search) {
        queryBuilder.andWhere('(preset.title ILIKE :search OR preset.description ILIKE :search)', {
          search: `%${search}%`,
        });
      }

      if (type) {
        queryBuilder.andWhere('preset.type = :type', { type });
      }

      if (level) {
        queryBuilder.andWhere('preset.level = :level', { level });
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('preset.isActive = :isActive', { isActive });
      }

      if (isPublic !== undefined) {
        queryBuilder.andWhere('preset.isPublic = :isPublic', { isPublic });
      }

      // Áp dụng sắp xếp
      const sortOrder = getPresetSortOrder(sort);
      Object.entries(sortOrder).forEach(([key, value]) => {
        queryBuilder.orderBy(`preset.${key}`, value as 'ASC' | 'DESC');
      }); // Thêm phân trang
      queryBuilder.skip(skip).take(limit);

      // Thực hiện truy vấn
      const [items, total] = await queryBuilder.getManyAndCount();

      return {
        items,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error getting preset exams:', error);
      throw new BadRequestException(`Failed to get preset exams: ${error.message}`);
    }
  }

  /**
   * Lấy chi tiết một bài thi preset theo ID
   */
  async getExamPresetById(id: number) {
    const preset = await this.examPresetRepository.findOne({
      where: { id },
      relations: ['questions', 'categories', 'createdBy'],
    });

    if (!preset) {
      throw new NotFoundException(`Examination preset with ID ${id} not found`);
    }

    return preset;
  }

  /**
   * Cập nhật thông tin bài thi preset
   */
  async updateExamPreset(id: number, data: UpdateExamPresetDto, userId: number) {
    const preset = await this.examPresetRepository.findOne({
      where: { id },
      relations: ['questions', 'categories', 'createdBy'],
    });

    if (!preset) {
      throw new NotFoundException(`Examination preset with ID ${id} not found`);
    }

    // Kiểm tra quyền
    if (preset.createdBy.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this preset');
    }

    try {
      // Cập nhật các câu hỏi nếu được cung cấp
      if (data.questionIds?.length) {
        const questions = await this.questionRepository.findByIds(data.questionIds);
        if (questions.length !== data.questionIds.length) {
          throw new BadRequestException('Some question IDs are invalid');
        }
        preset.questions = questions;
        preset.totalQuestions = data.questionIds.length;
      }

      // Cập nhật categories nếu có
      if (data.categoryIds?.length) {
        const categories = await this.categoryRepository.findByIds(data.categoryIds);
        if (categories.length !== data.categoryIds.length) {
          throw new BadRequestException('Some category IDs are invalid');
        }
        preset.categories = categories;
      }

      // Cập nhật các thuộc tính khác
      const updatableProps = [
        'title',
        'description',
        'type',
        'content',
        'level',
        'durationSeconds',
        'config',
        'isActive',
        'isPublic',
      ];

      for (const prop of updatableProps) {
        if (data[prop] !== undefined) {
          preset[prop] = data[prop];
        }
      }

      await this.examPresetRepository.save(preset);
      return this.getExamPresetById(id);
    } catch (error) {
      console.error('Error updating preset exam:', error);
      throw new BadRequestException(`Failed to update preset exam: ${error.message}`);
    }
  }

  /**
   * Xóa một bài thi preset
   */
  async deleteExamPreset(id: number, userId: number) {
    const preset = await this.examPresetRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!preset) {
      throw new NotFoundException(`Examination preset with ID ${id} not found`);
    }

    // Kiểm tra quyền
    if (preset.createdBy.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this preset');
    }

    await this.examPresetRepository.remove(preset);
    return { success: true };
  }

  /**
   * Bắt đầu làm bài thi từ một preset exam
   */
  async startPresetExam(presetId: number, userId: number) {
    // Kiểm tra xem người dùng có bài thi đang làm không
    const ongoingExam = await this.examinationRepository.findOne({
      where: {
        user: { id: userId },
        status: ExaminationStatus.IN_PROGRESS,
      },
    });

    if (ongoingExam) {
      throw new BadRequestException('You have an ongoing examination. Please complete it before starting a new one');
    }

    // Lấy thông tin preset
    const preset = await this.examPresetRepository.findOne({
      where: { id: presetId, isActive: true },
      relations: ['questions'],
    });

    if (!preset) {
      throw new NotFoundException(`Examination preset with ID ${presetId} not found or inactive`);
    }

    try {
      // Tạo bản ghi examination mới
      const examination = this.examinationRepository.create({
        user: { id: userId },
        startedAt: new Date(),
        status: ExaminationStatus.IN_PROGRESS,
        totalQuestions: preset.totalQuestions,
        durationSeconds: preset.durationSeconds,
        title: preset.title,
        description: preset.description,
      });

      const savedExam = await this.examinationRepository.save(examination);

      // Lấy danh sách câu hỏi từ preset
      let questions = [...preset.questions];

      // Nếu cấu hình có randomize, trộn câu hỏi
      if (preset.config?.randomize) {
        questions = this.shuffleArray(questions);
      }

      // Tạo các examination question từ danh sách câu hỏi
      const examQuestions = questions.map((question, index) => {
        return this.examQuestionRepository.create({
          examination: savedExam,
          question: question,
          orderIndex: index + 1,
        });
      });

      await this.examQuestionRepository.save(examQuestions);

      // Trả về examination đã tạo với đầy đủ thông tin
      return this.examinationRepository.findOne({
        where: { id: savedExam.id },
        relations: ['user', 'examinationQuestions', 'examinationQuestions.question'],
      });
    } catch (error) {
      console.error('Error starting preset exam:', error);
      throw new BadRequestException(`Failed to start preset exam: ${error.message}`);
    }
  }

  /**
   * Lấy kết quả chi tiết của bài thi dựa trên cấu hình hiển thị
   * Phương thức này sẽ hiển thị/ẩn thông tin dựa vào cấu hình của template bài thi
   */
  async getExaminationDetailedResults(examinationId: number, userId: number) {
    const examination = await this.examinationRepository.findOne({
      where: { id: examinationId },
      relations: [
        'user',
        'template',
        'examinationQuestions',
        'examinationQuestions.question',
        'examinationQuestions.question.options',
      ],
    });

    if (!examination) {
      throw new NotFoundException('Examination not found');
    }

    if (examination.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to view this examination');
    }

    if (examination.status !== ExaminationStatus.COMPLETED && examination.status !== ExaminationStatus.GRADED) {
      throw new BadRequestException('This examination has not been completed');
    }

    // Lấy cấu hình hiển thị kết quả từ template (nếu có)
    const resultDisplay = examination.template?.config?.resultDisplay || {
      showImmediately: true,
      showCorrectAnswers: true,
      showExplanation: true,
      showScoreBreakdown: true,
    };

    // Chuẩn bị kết quả cơ bản
    const result: any = {
      id: examination.id,
      title: examination.title,
      totalQuestions: examination.totalQuestions,
      correctAnswers: examination.correctAnswers,
      incorrectAnswers: examination.incorrectAnswers,
      skippedQuestions: examination.skippedQuestions,
      score: examination.score,
      percentageScore: examination.getPercentageScore(),
      isPassed: examination.isPassed(),
      status: examination.status,
      startedAt: examination.startedAt,
      completedAt: examination.completedAt,
      timeSpent: examination.getTimeSpent(),
      feedback: examination.feedback,
    };

    // Chỉ thêm chi tiết câu hỏi nếu cấu hình cho phép
    if (resultDisplay.showCorrectAnswers || resultDisplay.showExplanation || resultDisplay.showScoreBreakdown) {
      result.questions = examination.examinationQuestions.map((q) => {
        const questionResult: any = {
          id: q.id,
          questionId: q.question.id,
          content: q.question.content,
          type: q.question.type,
          userAnswer: q.userAnswer,
          isCorrect: q.isCorrect,
        };

        // Chỉ hiển thị đáp án đúng nếu cấu hình cho phép
        if (resultDisplay.showCorrectAnswers) {
          if (q.question.type === QuestionType.MULTIPLE_CHOICE) {
            const correctOptions = q.question.options.filter((opt) => opt.isCorrect).map((opt) => opt.id);
            questionResult.correctAnswer = correctOptions;
          } else {
            questionResult.correctAnswer = q.question.correctAnswer;
          }
        }

        // Chỉ hiển thị giải thích nếu cấu hình cho phép
        if (resultDisplay.showExplanation) {
          questionResult.explanation = q.question.explanation;
          questionResult.feedback = q.feedback;
        }

        // Chỉ hiển thị điểm số cho từng câu nếu cấu hình cho phép
        if (resultDisplay.showScoreBreakdown) {
          questionResult.score = q.score;
          questionResult.maxScore = q.question.points || 1;
        }

        return questionResult;
      });
    }

    return result;
  }
}
