import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ExaminationAttemptService } from './examination-attempt.service';
import { JwtAuthGuard } from '@common/security/jwt.guard';
import { StartExaminationDto } from './dtos/start-examination.dto';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { CreateExamTemplateDto } from './dtos/template/create-exam-template.dto';
import { UpdateExamTemplateDto } from './dtos/template/update-exam-template.dto';
import { GetExamTemplatesDto } from './dtos/template/get-exam-templates.dto';
import { CreateExamPresetDto } from './dtos/preset/create-exam-preset.dto';
import { UpdateExamPresetDto } from './dtos/preset/update-exam-preset.dto';
import { GetExamPresetsDto } from './dtos/preset/get-exam-presets.dto';

@Controller('examinations')
export class ExaminationAttemptController {
  constructor(private readonly examinationAttemptService: ExaminationAttemptService) {}

  // START
  @UseGuards(JwtAuthGuard)
  @Post('start')
  startExamination(@Body() startExamDto: StartExaminationDto, @Request() req) {
    return this.examinationAttemptService.startExamination(startExamDto.templateId, req.user.id);
  }

  // SUBMIT
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit-answer')
  submitAnswer(@Param('id', ParseIntPipe) examinationId: number, @Body() answerDto: SubmitAnswerDto, @Request() req) {
    return this.examinationAttemptService.submitAnswer(examinationId, answerDto, req.user.id);
  }

  // COMPLETE
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  completeExamination(@Param('id', ParseIntPipe) examinationId: number, @Request() req) {
    return this.examinationAttemptService.completeExamination(examinationId, req.user.id);
  }

  // GET CURRENT
  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrentExamination(@Request() req) {
    return this.examinationAttemptService.getCurrentExamination(req.user.id);
  }

  // GET USER HISTORY
  @UseGuards(JwtAuthGuard)
  @Get('my-history')
  getMyExaminationHistory(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.examinationAttemptService.getUserExaminationHistory(req.user.id, page, limit);
  }

  // GET EXAMINATION DETAIL
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getExaminationDetail(@Param('id', ParseIntPipe) examinationId: number, @Request() req) {
    return this.examinationAttemptService.getExaminationDetail(examinationId, req.user.id);
  }

  // GET EXAMINATION RESULTS WITH DETAILED ANSWERS
  @UseGuards(JwtAuthGuard)
  @Get(':id/results')
  getExaminationDetailedResults(@Param('id', ParseIntPipe) examinationId: number, @Request() req) {
    return this.examinationAttemptService.getExaminationDetailedResults(examinationId, req.user.id);
  }

  // ========= PRESET EXAMINATION ENDPOINTS =========

  // CREATE EXAM PRESET
  @UseGuards(JwtAuthGuard)
  @Post('presets')
  createExamPreset(@Body() createDto: CreateExamPresetDto, @Request() req) {
    return this.examinationAttemptService.createExamPreset(createDto, req.user.id);
  }

  // GET PRESET EXAMS
  @UseGuards(JwtAuthGuard)
  @Get('presets')
  getExamPresets(@Query() queryParams: GetExamPresetsDto, @Request() req) {
    return this.examinationAttemptService.getExamPresets(queryParams, req.user.id);
  }

  // GET PRESET EXAM BY ID
  @UseGuards(JwtAuthGuard)
  @Get('presets/:id')
  getExamPresetById(@Param('id', ParseIntPipe) presetId: number, @Request() req) {
    return this.examinationAttemptService.getExamPresetById(presetId);
  }

  // UPDATE PRESET EXAM
  @UseGuards(JwtAuthGuard)
  @Put('presets/:id')
  updateExamPreset(
    @Param('id', ParseIntPipe) presetId: number,
    @Body() updateDto: UpdateExamPresetDto,
    @Request() req,
  ) {
    return this.examinationAttemptService.updateExamPreset(presetId, updateDto, req.user.id);
  }

  // DELETE PRESET EXAM
  @UseGuards(JwtAuthGuard)
  @Delete('presets/:id')
  deleteExamPreset(@Param('id', ParseIntPipe) presetId: number, @Request() req) {
    return this.examinationAttemptService.deleteExamPreset(presetId, req.user.id);
  }

  // START PRESET EXAM
  @UseGuards(JwtAuthGuard)
  @Post('presets/:id/start')
  startPresetExam(@Param('id', ParseIntPipe) presetId: number, @Request() req) {
    return this.examinationAttemptService.startPresetExam(presetId, req.user.id);
  }
}
