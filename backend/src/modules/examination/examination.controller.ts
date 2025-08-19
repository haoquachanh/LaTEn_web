import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { CreateExaminationDto } from './dtos/create-examination.dto';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { Examination } from '@entities/examination.entity';
import { JwtAuthGuard } from '@common/security/jwt.guard';
import { CreateExamTemplateDto } from '../examination-attempt/dtos/template/create-exam-template.dto';
import { UpdateExamTemplateDto } from '../examination-attempt/dtos/template/update-exam-template.dto';
import { GetExamTemplatesDto } from '../examination-attempt/dtos/template/get-exam-templates.dto';
import { ExaminationAttemptService } from '../examination-attempt/examination-attempt.service';
import { LeaderboardService } from './services/leaderboard.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('examinations')
export class ExaminationController {
  constructor(
    private readonly examinationService: ExaminationService,
    private readonly examinationAttemptService: ExaminationAttemptService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateExaminationDto, @Request() req): Promise<Partial<Examination>> {
    req.user.id = dto.userId;
    return this.examinationService.create({ ...dto, userId: req.user.id });
  }

  @Post('submit-answer')
  submitAnswer(@Body() dto: SubmitAnswerDto) {
    return this.examinationService.submitAnswer(dto);
  }

  @ApiOperation({ summary: 'Complete an examination and calculate score' })
  @ApiResponse({ status: 200, description: 'Examination completed successfully', type: Examination })
  @ApiResponse({ status: 404, description: 'Examination not found' })
  @Patch(':id/complete')
  async completeExam(@Param('id', ParseIntPipe) id: number) {
    const exam = await this.examinationService.completeExamination(id);

    // Update leaderboard scores
    if (exam.user && exam.user.id) {
      await this.leaderboardService.updateUserScores(
        exam.user.id,
        exam.score,
        exam.correctAnswers,
        exam.totalQuestions,
      );
    }

    return exam;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancelExamination(@Param('id', ParseIntPipe) id: number) {
    return this.examinationService.cancelExamination(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  searchExaminations(@Query('q') query: string, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.examinationService.searchExaminations(query, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  getUserExaminations(@Param('userId', ParseIntPipe) userId: number) {
    return this.examinationService.getUserExaminations(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats/:userId')
  getExaminationStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.examinationService.getExaminationStats(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getExamination(@Param('id', ParseIntPipe) id: number) {
    return this.examinationService.getExaminationById(id);
  }

  // PRESETS-EXAM ENDPOINTS

  // GET ALL PRESETS: Lấy danh sách các bài thi mẫu (public endpoint, không yêu cầu xác thực)
  @Get('presets')
  getExamPresets(@Query() query: GetExamTemplatesDto, @Request() req) {
    const userId = req.user?.id || null; // userId sẽ là null nếu không có xác thực
    return this.examinationAttemptService.getExamTemplates(query, userId);
  }

  // GET PRESET BY ID: Lấy chi tiết một bài thi mẫu (public endpoint, không yêu cầu xác thực)
  @Get('presets/:id')
  getExamPresetById(@Param('id', ParseIntPipe) presetId: number) {
    return this.examinationAttemptService.getExamTemplateById(presetId);
  }

  // CREATE PRESET: Tạo một bài thi mẫu mới
  @UseGuards(JwtAuthGuard)
  @Post('presets')
  createExamPreset(@Body() createPresetDto: CreateExamTemplateDto, @Request() req) {
    return this.examinationAttemptService.createExamTemplate(createPresetDto, req.user.id);
  }

  // UPDATE PRESET: Cập nhật bài thi mẫu
  @UseGuards(JwtAuthGuard)
  @Put('presets/:id')
  updateExamPreset(
    @Param('id', ParseIntPipe) presetId: number,
    @Body() updatePresetDto: UpdateExamTemplateDto,
    @Request() req,
  ) {
    return this.examinationAttemptService.updateExamTemplate(presetId, updatePresetDto, req.user.id);
  }

  // DELETE PRESET: Xóa bài thi mẫu
  @UseGuards(JwtAuthGuard)
  @Delete('presets/:id')
  deleteExamPreset(@Param('id', ParseIntPipe) presetId: number, @Request() req) {
    return this.examinationAttemptService.deleteExamTemplate(presetId, req.user.id);
  }
}
