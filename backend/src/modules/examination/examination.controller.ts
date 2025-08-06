import { Controller, Post, Get, Body, Patch, Param, Query, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { CreateExaminationDto } from './dtos/create-examination.dto';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { Examination } from '@entities/examination.entity';
import { JwtAuthGuard } from '@common/security/jwt.guard';

@Controller('examinations')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

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

  @Patch(':id/complete')
  completeExam(@Param('id', ParseIntPipe) id: number) {
    return this.examinationService.completeExamination(id);
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
}
