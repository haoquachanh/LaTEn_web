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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Examinations')
@Controller('examinations')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

  @ApiOperation({ summary: 'Get all active examinations' })
  @ApiResponse({ status: 200, description: 'List of examinations' })
  @Get()
  async getAllExaminations(): Promise<ExaminationEntity[]> {
    return this.examinationService.getAllExaminations();
  }

  @ApiOperation({ summary: 'Get examination by ID' })
  @ApiResponse({ status: 200, description: 'Examination details' })
  @ApiResponse({ status: 404, description: 'Examination not found' })
  @Get(':id')
  async getExaminationById(@Param('id', ParseIntPipe) id: number): Promise<ExaminationEntity> {
    return this.examinationService.getExaminationById(id);
  }

  @ApiOperation({ summary: 'Get examinations by type' })
  @ApiResponse({ status: 200, description: 'List of examinations by type' })
  @Get('type/:type')
  async getExaminationsByType(@Param('type') type: ExaminationType): Promise<ExaminationEntity[]> {
    return this.examinationService.getExaminationsByType(type);
  }

  @ApiOperation({ summary: 'Get examinations by level' })
  @ApiResponse({ status: 200, description: 'List of examinations by level' })
  @Get('level/:level')
  async getExaminationsByLevel(@Param('level') level: ExaminationLevel): Promise<ExaminationEntity[]> {
    return this.examinationService.getExaminationsByLevel(level);
  }

  @ApiOperation({ summary: 'Create new examination' })
  @ApiResponse({ status: 201, description: 'Examination created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createExamination(
    @Body(ValidationPipe) examinationData: Partial<ExaminationEntity>,
    @Request() req,
  ): Promise<ExaminationEntity> {
    return this.examinationService.createExamination(examinationData, req.user);
  }

  @ApiOperation({ summary: 'Update examination' })
  @ApiResponse({ status: 200, description: 'Examination updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your examination' })
  @ApiResponse({ status: 404, description: 'Examination not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateExamination(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateData: Partial<ExaminationEntity>,
    @Request() req,
  ): Promise<ExaminationEntity> {
    return this.examinationService.updateExamination(id, updateData, req.user.id);
  }

  @ApiOperation({ summary: 'Delete examination' })
  @ApiResponse({ status: 200, description: 'Examination deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your examination' })
  @ApiResponse({ status: 404, description: 'Examination not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteExamination(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    await this.examinationService.deleteExamination(id, req.user.id);
    return { message: 'Examination deleted successfully' };
  }

  @ApiOperation({ summary: 'Submit examination answers' })
  @ApiResponse({ status: 201, description: 'Examination submitted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Examination not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  async submitExamination(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) submitData: { answers: any[]; timeSpent?: number },
    @Request() req,
  ): Promise<ExaminationResult> {
    return this.examinationService.submitExamination(id, submitData.answers, req.user.id);
  }

  @ApiOperation({ summary: 'Get user examination results' })
  @ApiResponse({ status: 200, description: 'User examination results' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('results/my')
  async getUserResults(@Request() req): Promise<ExaminationResult[]> {
    return this.examinationService.getUserResults(req.user.id);
  }

  @ApiOperation({ summary: 'Get examination results' })
  @ApiResponse({ status: 200, description: 'Examination results' })
  @Get(':id/results')
  async getExaminationResults(@Param('id', ParseIntPipe) id: number): Promise<ExaminationResult[]> {
    return this.examinationService.getExaminationResults(id);
  }
}
