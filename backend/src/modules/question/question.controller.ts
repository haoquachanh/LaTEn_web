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
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '@common/security/jwt.guard';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dtos/create-question.dto';
import { QuestionType, QuestionMode } from '@entities/question.entity';
import { RolesGuard } from '../../common/security/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/typings/user-role.enum';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
    return await this.questionService.createQuestion(createQuestionDto, req.user);
  }

  @Get()
  async findAllQuestions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type?: QuestionType,
    @Query('mode') mode?: QuestionMode,
  ) {
    return await this.questionService.findAllQuestions(page, limit, type, mode);
  }

  @Get('random')
  async getRandomQuestions(
    @Query('count', ParseIntPipe) count: number,
    @Query('type') type?: QuestionType,
    @Query('mode') mode?: QuestionMode,
  ) {
    return await this.questionService.getRandomQuestions(count, type, mode);
  }

  @Get(':id')
  async findQuestionById(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.findQuestionById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Request() req,
  ) {
    return await this.questionService.updateQuestion(id, updateQuestionDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async deleteQuestion(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.questionService.deleteQuestion(id, req.user);
    return { message: 'Question deleted successfully' };
  }
}
