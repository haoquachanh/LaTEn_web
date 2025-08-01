import {
  Controller,
  Get,
  Post,
  Put,
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
import { ExaminationEntity, ExaminationType, ExaminationLevel } from '@entities/examination.entity';
import { ExaminationResult } from '@entities/examination-result.entity';

@Controller('examinations')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

  @Get()
  async getAllExaminations(): Promise<ExaminationEntity[]> {
    return this.examinationService.getAllExaminations();
  }

  @Get(':id')
  async getExaminationById(@Param('id', ParseIntPipe) id: number): Promise<ExaminationEntity> {
    return this.examinationService.getExaminationById(id);
  }

  @Get('type/:type')
  async getExaminationsByType(@Param('type') type: ExaminationType): Promise<ExaminationEntity[]> {
    return this.examinationService.getExaminationsByType(type);
  }

  @Get('level/:level')
  async getExaminationsByLevel(@Param('level') level: ExaminationLevel): Promise<ExaminationEntity[]> {
    return this.examinationService.getExaminationsByLevel(level);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExamination(
    @Body(ValidationPipe) examinationData: Partial<ExaminationEntity>,
    @Request() req,
  ): Promise<ExaminationEntity> {
    return this.examinationService.createExamination(examinationData, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateExamination(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateData: Partial<ExaminationEntity>,
    @Request() req,
  ): Promise<ExaminationEntity> {
    return this.examinationService.updateExamination(id, updateData, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteExamination(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    await this.examinationService.deleteExamination(id, req.user.id);
    return { message: 'Examination deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  async submitExamination(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) submitData: { answers: any[]; timeSpent?: number },
    @Request() req,
  ): Promise<ExaminationResult> {
    return this.examinationService.submitExamination(id, submitData.answers, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('results/my')
  async getUserResults(@Request() req): Promise<ExaminationResult[]> {
    return this.examinationService.getUserResults(req.user.id);
  }

  @Get(':id/results')
  async getExaminationResults(@Param('id', ParseIntPipe) id: number): Promise<ExaminationResult[]> {
    return this.examinationService.getExaminationResults(id);
  }
}
