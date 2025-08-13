import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { ExaminationPreset } from '@entities/examination-preset.entity';
import { Question } from '@entities/question.entity';
import { QuestionCategory } from '@entities/question-category.entity';
import { UserEntity } from '@entities/user.entity';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationMetadata } from '@common/typings/examination-metadata';
import { CreatePresetDto, UpdatePresetDto } from './dtos/preset-dto';
import { PaginationDto } from '@common/typings/pagination.dto';
import { ExaminationService } from './examination.service';

@Injectable()
export class ExaminationPresetService {
  constructor(
    @InjectRepository(ExaminationPreset)
    private readonly presetRepo: Repository<ExaminationPreset>,

    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,

    @InjectRepository(QuestionCategory)
    private readonly categoryRepo: Repository<QuestionCategory>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(Examination)
    private readonly examRepo: Repository<Examination>,

    @InjectRepository(ExaminationQuestion)
    private readonly examQuestionRepo: Repository<ExaminationQuestion>,

    private readonly examinationService: ExaminationService,
  ) {}

  /**
   * Tạo một preset examination mới
   *
   * @param dto Thông tin để tạo preset
   * @param userId ID của người tạo
   * @returns Preset đã tạo
   */
  async create(dto: CreatePresetDto, userId: number): Promise<ExaminationPreset> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra các câu hỏi có tồn tại hay không
    let questions: Question[] = [];
    if (dto.questionIds && dto.questionIds.length > 0) {
      questions = await this.questionRepo.findByIds(dto.questionIds);
      if (questions.length !== dto.questionIds.length) {
        throw new BadRequestException('Some questions do not exist');
      }
    }

    // Kiểm tra các danh mục có tồn tại hay không
    let categories: QuestionCategory[] = [];
    if (dto.categoryIds && dto.categoryIds.length > 0) {
      categories = await this.categoryRepo.findByIds(dto.categoryIds);
      if (categories.length !== dto.categoryIds.length) {
        throw new BadRequestException('Some categories do not exist');
      }
    }

    // Tạo preset mới
    const preset = this.presetRepo.create({
      title: dto.title,
      description: dto.description,
      type: dto.type || 'multiple',
      content: dto.content || 'reading',
      level: dto.level || 'medium',
      totalQuestions: dto.totalQuestions || questions.length,
      durationSeconds: dto.durationSeconds,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      isPublic: dto.isPublic !== undefined ? dto.isPublic : false,
      config: dto.config || {},
      createdBy: user,
      questions,
      categories,
    });

    return this.presetRepo.save(preset);
  }

  /**
   * Cập nhật thông tin một preset examination
   *
   * @param id ID của preset cần cập nhật
   * @param dto Thông tin cập nhật
   * @param userId ID của người thực hiện cập nhật
   * @returns Preset đã cập nhật
   */
  async update(id: number, dto: UpdatePresetDto, userId: number): Promise<ExaminationPreset> {
    const preset = await this.presetRepo.findOne({
      where: { id },
      relations: ['createdBy', 'questions', 'categories'],
    });

    if (!preset) {
      throw new NotFoundException('Preset examination not found');
    }

    // Kiểm tra quyền chỉnh sửa
    if (preset.createdBy?.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this preset');
    }

    // Cập nhật các trường cơ bản
    if (dto.title !== undefined) preset.title = dto.title;
    if (dto.description !== undefined) preset.description = dto.description;
    if (dto.type !== undefined) preset.type = dto.type;
    if (dto.content !== undefined) preset.content = dto.content;
    if (dto.level !== undefined) preset.level = dto.level;
    if (dto.durationSeconds !== undefined) preset.durationSeconds = dto.durationSeconds;
    if (dto.isActive !== undefined) preset.isActive = dto.isActive;
    if (dto.isPublic !== undefined) preset.isPublic = dto.isPublic;
    if (dto.config !== undefined) {
      // Hợp nhất cấu hình hiện tại với cấu hình mới
      preset.config = { ...preset.config, ...dto.config };
    }

    // Cập nhật danh sách câu hỏi nếu có
    if (dto.questionIds !== undefined) {
      const questions = await this.questionRepo.findByIds(dto.questionIds);
      if (questions.length !== dto.questionIds.length) {
        throw new BadRequestException('Some questions do not exist');
      }
      preset.questions = questions;
      preset.totalQuestions = questions.length;
    }

    // Cập nhật danh mục nếu có
    if (dto.categoryIds !== undefined) {
      const categories = await this.categoryRepo.findByIds(dto.categoryIds);
      if (categories.length !== dto.categoryIds.length) {
        throw new BadRequestException('Some categories do not exist');
      }
      preset.categories = categories;
    }

    return this.presetRepo.save(preset);
  }

  /**
   * Xóa một preset examination
   *
   * @param id ID của preset cần xóa
   * @param userId ID của người thực hiện xóa
   * @returns Kết quả xóa
   */
  async delete(id: number, userId: number): Promise<{ success: boolean }> {
    const preset = await this.presetRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!preset) {
      throw new NotFoundException('Preset examination not found');
    }

    // Kiểm tra quyền xóa
    if (preset.createdBy?.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this preset');
    }

    await this.presetRepo.remove(preset);
    return { success: true };
  }

  /**
   * Lấy thông tin chi tiết một preset examination
   *
   * @param id ID của preset cần lấy
   * @returns Chi tiết preset
   */
  async findById(id: number): Promise<ExaminationPreset> {
    const preset = await this.presetRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options', 'categories', 'createdBy'],
    });

    if (!preset) {
      throw new NotFoundException('Preset examination not found');
    }

    return preset;
  }

  /**
   * Lấy danh sách các preset examination theo điều kiện tìm kiếm và phân trang
   *
   * @param options Các tham số tìm kiếm và phân trang
   * @returns Danh sách preset và thông tin phân trang
   */
  async findAll(options: {
    search?: string;
    level?: string;
    isActive?: boolean;
    isPublic?: boolean;
    createdById?: number;
    pagination: PaginationDto;
  }): Promise<{ data: ExaminationPreset[]; meta: { total: number; page: number; limit: number } }> {
    const { search, level, isActive, isPublic, createdById } = options;
    const { page = 1, limit = 10 } = options.pagination;

    // Xây dựng điều kiện tìm kiếm
    const where: FindOptionsWhere<ExaminationPreset> = {};

    if (search) {
      where.title = Like(`%${search}%`);
    }

    if (level) {
      where.level = level;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (createdById) {
      where.createdBy = { id: createdById };
    }

    // Thực hiện truy vấn với phân trang
    const [data, total] = await this.presetRepo.findAndCount({
      where,
      relations: ['createdBy', 'categories'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  /**
   * Bắt đầu một bài thi từ một preset examination
   *
   * @param presetId ID của preset
   * @param userId ID của người dùng
   * @returns Bài thi đã được tạo
   */
  async startExamination(presetId: number, userId: number): Promise<Examination> {
    const preset = await this.findById(presetId);
    if (!preset.isActive) {
      throw new BadRequestException('This examination preset is not active');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Lấy danh sách câu hỏi từ preset
    let questions = [...preset.questions];

    // Nếu cấu hình cho phép ngẫu nhiên thứ tự câu hỏi
    if (preset.config?.randomize) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    // Tạo bài thi mới bằng cách khởi tạo đối tượng trực tiếp
    const examination = new Examination();
    examination.title = preset.title;
    examination.description = preset.description;
    examination.totalQuestions = questions.length;
    examination.durationSeconds = preset.durationSeconds;
    examination.startedAt = new Date();
    examination.user = user;

    // Khởi tạo metadata
    examination.metadata = {
      fromPreset: true,
      presetId: preset.id,
      presetConfig: preset.config,
    } as ExaminationMetadata;

    const savedExam = await this.examRepo.save(examination);

    // Tạo các câu hỏi cho bài thi bằng cách khởi tạo đối tượng trực tiếp
    const examQuestions = questions.map((question, index) => {
      const examQuestion = new ExaminationQuestion();
      examQuestion.examination = savedExam;
      examQuestion.question = question;
      examQuestion.orderIndex = index + 1;

      // Nếu cấu hình cho phép ngẫu nhiên thứ tự các lựa chọn
      if (preset.config?.security?.shuffleOptions && question.options?.length > 0) {
        // Tạo bản sao để không ảnh hưởng đến câu hỏi gốc
        examQuestion.optionsOrder = question.options.map((o) => o.id).sort(() => Math.random() - 0.5);
      }

      return examQuestion;
    });

    await this.examQuestionRepo.save(examQuestions);

    // Trả về bài thi đã tạo với đầy đủ thông tin
    return this.examinationService.getExaminationById(savedExam.id);
  }

  /**
   * Lấy danh sách các preset examination do người dùng tạo
   *
   * @param userId ID của người dùng
   * @param pagination Thông tin phân trang
   * @returns Danh sách preset và thông tin phân trang
   */
  async getUserPresets(
    userId: number,
    pagination: PaginationDto,
  ): Promise<{ data: ExaminationPreset[]; meta: { total: number; page: number; limit: number } }> {
    return this.findAll({
      createdById: userId,
      pagination,
    });
  }

  /**
   * Lấy danh sách các preset examination công khai
   *
   * @param pagination Thông tin phân trang
   * @returns Danh sách preset công khai và thông tin phân trang
   */
  async getPublicPresets(
    pagination: PaginationDto,
  ): Promise<{ data: ExaminationPreset[]; meta: { total: number; page: number; limit: number } }> {
    return this.findAll({
      isPublic: true,
      isActive: true,
      pagination,
    });
  }

  /**
   * Sao chép một preset examination thành của người dùng hiện tại
   *
   * @param presetId ID của preset cần sao chép
   * @param userId ID của người dùng hiện tại
   * @returns Preset đã sao chép
   */
  async clonePreset(presetId: number, userId: number): Promise<ExaminationPreset> {
    const originalPreset = await this.findById(presetId);
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra preset có công khai hoặc người dùng có quyền truy cập
    if (!originalPreset.isPublic && originalPreset.createdBy?.id !== userId) {
      throw new ForbiddenException('You do not have permission to clone this preset');
    }

    // Tạo một bản sao của preset
    const clonedPreset = this.presetRepo.create({
      title: `Copy of ${originalPreset.title}`,
      description: originalPreset.description,
      type: originalPreset.type,
      content: originalPreset.content,
      level: originalPreset.level,
      totalQuestions: originalPreset.totalQuestions,
      durationSeconds: originalPreset.durationSeconds,
      config: originalPreset.config,
      isActive: true,
      isPublic: false, // Mặc định không công khai bản sao
      createdBy: user,
      questions: originalPreset.questions,
      categories: originalPreset.categories,
    });

    return this.presetRepo.save(clonedPreset);
  }

  /**
   * Cập nhật cấu hình hiển thị kết quả cho preset
   *
   * @param id ID của preset
   * @param config Cấu hình hiển thị kết quả
   * @param userId ID của người dùng thực hiện cập nhật
   * @returns Preset đã cập nhật
   */
  async updateResultDisplayConfig(
    id: number,
    config: {
      showImmediately?: boolean;
      showCorrectAnswers?: boolean;
      showExplanation?: boolean;
      showScoreBreakdown?: boolean;
    },
    userId: number,
  ): Promise<ExaminationPreset> {
    const preset = await this.presetRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!preset) {
      throw new NotFoundException('Preset examination not found');
    }

    // Kiểm tra quyền chỉnh sửa
    if (preset.createdBy?.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this preset');
    }

    // Cập nhật cấu hình hiển thị kết quả
    preset.config = {
      ...preset.config,
      resultDisplay: {
        ...preset.config?.resultDisplay,
        ...config,
      },
    };

    return this.presetRepo.save(preset);
  }

  /**
   * Cập nhật cấu hình bảo mật cho preset
   *
   * @param id ID của preset
   * @param config Cấu hình bảo mật
   * @param userId ID của người dùng thực hiện cập nhật
   * @returns Preset đã cập nhật
   */
  async updateSecurityConfig(
    id: number,
    config: {
      preventCopy?: boolean;
      preventTabSwitch?: boolean;
      timeoutWarning?: number;
      shuffleOptions?: boolean;
    },
    userId: number,
  ): Promise<ExaminationPreset> {
    const preset = await this.presetRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!preset) {
      throw new NotFoundException('Preset examination not found');
    }

    // Kiểm tra quyền chỉnh sửa
    if (preset.createdBy?.id !== userId) {
      throw new ForbiddenException('You do not have permission to update this preset');
    }

    // Cập nhật cấu hình bảo mật
    preset.config = {
      ...preset.config,
      security: {
        ...preset.config?.security,
        ...config,
      },
    };

    return this.presetRepo.save(preset);
  }

  /**
   * Thống kê về các lần làm bài từ preset này
   *
   * @param id ID của preset
   * @param userId ID của người dùng (để kiểm tra quyền)
   * @returns Thống kê về preset
   */
  async getPresetStats(id: number, userId: number): Promise<any> {
    const preset = await this.presetRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!preset) {
      throw new NotFoundException('Preset examination not found');
    }

    // Chỉ người tạo mới xem được thống kê
    if (preset.createdBy?.id !== userId) {
      throw new ForbiddenException('You do not have permission to view this preset statistics');
    }

    // Lấy tất cả các bài thi từ preset này
    const examinations = await this.examRepo
      .find({
        where: {
          // Sử dụng Raw JSON query thay vì truy vấn JSONB trực tiếp
          // để tránh lỗi typing với FindOptionsWhere
          // Có thể sử dụng Raw để truy vấn JSONB trong PostgreSQL
          // Đây là cách an toàn để truy vấn metadata mà không gây lỗi typing
        },
        relations: ['user'],
      })
      .then((exams) =>
        exams.filter((e) => e.metadata && e.metadata.fromPreset === true && e.metadata.presetId === preset.id),
      );

    // Tính toán các thống kê
    const totalAttempts = examinations.length;
    const completedAttempts = examinations.filter((e) => e.completedAt !== null).length;
    const averageScore =
      completedAttempts > 0
        ? examinations.filter((e) => e.completedAt !== null).reduce((acc, exam) => acc + exam.score, 0) /
          completedAttempts
        : 0;

    return {
      totalAttempts,
      completedAttempts,
      averageScore,
      passRate:
        completedAttempts > 0
          ? examinations.filter((e) => e.completedAt !== null && e.score >= (preset.config?.passingScore || 60))
              .length / completedAttempts
          : 0,
      recentAttempts: examinations
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 5)
        .map((e) => ({
          id: e.id,
          userId: e.user.id,
          username: e.user.fullname || `User ${e.user.id}`, // Sử dụng fullname thay cho username
          score: e.score,
          completedAt: e.completedAt,
          timeSpent: e.completedAt
            ? Math.floor((new Date(e.completedAt).getTime() - new Date(e.startedAt).getTime()) / 1000)
            : null,
        })),
    };
  }
}
