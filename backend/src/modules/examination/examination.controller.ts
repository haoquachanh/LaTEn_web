import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { JwtAuthGuard } from '@common/security/jwt.guard';
import { Examination } from '@entities/examination.entity';
import { QuestionType, QuestionMode } from '@entities/question.entity';
import { CreateExaminationDto, SubmitExaminationDto } from './dtos/examination.dto';

@Controller('examinations')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyExaminations(@Request() req): Promise<Examination[]> {
    return this.examinationService.getUserExaminations(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getExaminationById(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Examination> {
    return this.examinationService.getExaminationById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getExaminations(
    @Query('type') type?: QuestionType,
    @Query('mode') mode?: QuestionMode,
  ): Promise<Examination[]> {
    return this.examinationService.getExaminations(type, mode);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start')
  async startExamination(@Body(ValidationPipe) examData: CreateExaminationDto, @Request() req): Promise<Examination> {
    return this.examinationService.startExamination(examData, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitExamination(
    @Body(ValidationPipe) submitData: SubmitExaminationDto,
    @Request() req,
  ): Promise<Examination> {
    return this.examinationService.submitExamination(submitData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteExamination(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    await this.examinationService.deleteExamination(id, req.user.id);
    return { message: 'Examination deleted successfully' };
  }
}
