import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Examination } from '@entities/examination.entity';
import { ExaminationQuestion } from '@entities/examination-question.entity';
import { ExaminationStatus } from '@entities/enums/examination-status.enum';
import { QuestionType } from '@common/typings/question-type.enum';
import { QuestionOption } from '@entities/question-option.entity';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { AnswerResponse, ExaminationSummary } from './interfaces/examination.interface';

@Injectable()
export class ExaminationAttemptService {
  constructor(
    @InjectRepository(Examination)
    private readonly examinationRepository: Repository<Examination>,
    @InjectRepository(ExaminationQuestion)
    private readonly examQuestionRepository: Repository<ExaminationQuestion>,
  ) {}

  async startExamination(examId: number, userId: number) {
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

    // Tạo một bản ghi examination mới với thông tin từ template hoặc config
    // Ở đây ta giả định rằng examId là một template hoặc cấu hình cho bài thi

    const newExamination = this.examinationRepository.create({
      user: { id: userId },
      startedAt: new Date(),
      status: ExaminationStatus.IN_PROGRESS,
      totalQuestions: 0, // Cần tính toán dựa trên số lượng câu hỏi
      durationSeconds: 3600, // 1 giờ (hoặc lấy từ cấu hình)
      title: 'New Examination', // Cần lấy từ template hoặc cấu hình
    });

    await this.examinationRepository.save(newExamination);

    // TODO: Tạo các examination question từ nguồn câu hỏi
    // Ví dụ cách tạo câu hỏi (cần triển khai chi tiết hơn):
    // 1. Lấy danh sách câu hỏi từ ngân hàng câu hỏi hoặc từ cấu hình
    // 2. Tạo các examination question liên kết với bài thi mới
    // 3. Cập nhật totalQuestions

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
      relations: ['user', 'examinationQuestions'],
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

    // Trả về tổng kết
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
}
