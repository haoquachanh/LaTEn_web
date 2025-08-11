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
}
