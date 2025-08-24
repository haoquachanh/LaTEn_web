import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { GetQuestionsDto } from './dtos/get-questions.dto';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';
import { QandAService } from './qanda.service';

@Controller('qanda')
export class QandAController {
  constructor(private readonly qandaService: QandAService) {}

  // Question endpoints

  @Post('questions')
  @UseGuards(JwtAuthGuard)
  async createQuestion(@Req() req, @Body() createQuestionDto: CreateQuestionDto): Promise<any> {
    const userId = req.user.id;
    const question = await this.qandaService.createQuestion(userId, createQuestionDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Question created successfully',
      data: question,
    };
  }

  @Get('questions')
  @UseGuards(JwtAuthGuard)
  async getAllQuestions(@Req() req, @Query() queryParams: GetQuestionsDto): Promise<any> {
    const userId = req.user.id;
    const questions = await this.qandaService.getAllQuestions(queryParams, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Questions retrieved successfully',
      data: questions,
    };
  }

  @Get('questions/:id')
  @UseGuards(JwtAuthGuard)
  async getQuestionById(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.id;
    const question = await this.qandaService.getQuestionById(id, userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  @Patch('questions/:id')
  @UseGuards(JwtAuthGuard)
  async updateQuestion(
    @Req() req,
    @Param('id') id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<any> {
    const userId = req.user.id;
    const question = await this.qandaService.updateQuestion(userId, id, updateQuestionDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question updated successfully',
      data: question,
    };
  }

  @Delete('questions/:id')
  @UseGuards(JwtAuthGuard)
  async deleteQuestion(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.id;
    await this.qandaService.deleteQuestion(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Question deleted successfully',
    };
  }

  // Answer endpoints

  @Post('questions/:id/answers')
  @UseGuards(JwtAuthGuard)
  async addAnswer(@Req() req, @Param('id') id: number, @Body() createAnswerDto: CreateAnswerDto): Promise<any> {
    const userId = req.user.id;
    const answer = await this.qandaService.addAnswer(userId, id, createAnswerDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Answer added successfully',
      data: answer,
    };
  }

  @Patch('answers/:id')
  @UseGuards(JwtAuthGuard)
  async updateAnswer(@Req() req, @Param('id') id: number, @Body() updateAnswerDto: UpdateAnswerDto): Promise<any> {
    const userId = req.user.id;
    const answer = await this.qandaService.updateAnswer(userId, id, updateAnswerDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Answer updated successfully',
      data: answer,
    };
  }

  @Delete('answers/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAnswer(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.id;
    await this.qandaService.deleteAnswer(userId, id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Answer deleted successfully',
    };
  }

  @Post('questions/:questionId/answers/:answerId/accept')
  @UseGuards(JwtAuthGuard)
  async acceptAnswer(
    @Req() req,
    @Param('questionId') questionId: number,
    @Param('answerId') answerId: number,
  ): Promise<any> {
    const userId = req.user.id;
    const answer = await this.qandaService.acceptAnswer(userId, answerId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Answer accepted successfully',
      data: answer,
    };
  }
}
