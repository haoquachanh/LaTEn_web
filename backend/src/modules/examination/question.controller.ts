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
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { CreateQuestionCategoryDto, UpdateQuestionCategoryDto } from './dtos/question-category.dto';
import { CreateQuestionBankDto, UpdateQuestionBankDto } from './dtos/question-bank.dto';
import { QuestionType, QuestionFormat, DifficultyLevel } from '../../entities/question.entity';
import { RolesGuard } from '../../common/security/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/typings/user-role.enum';
import { User } from '../../common/decorators/user.decorator';
import { UserEntity } from '../../entities/user.entity';

@ApiTags('Questions')
@Controller('questions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // Question CRUD
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Question created successfully' })
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionService.createQuestion(createQuestionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: QuestionType })
  @ApiQuery({ name: 'format', required: false, enum: QuestionFormat })
  @ApiQuery({ name: 'difficulty', required: false, enum: DifficultyLevel })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'bankId', required: false, type: Number })
  async findAllQuestions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type?: QuestionType,
    @Query('format') format?: QuestionFormat,
    @Query('difficulty') difficulty?: DifficultyLevel,
    @Query('categoryId') categoryId?: number,
    @Query('bankId') bankId?: number,
  ) {
    return await this.questionService.findAllQuestions(
      page,
      limit,
      type,
      format,
      difficulty,
      categoryId,
      bankId,
    );
  }

  @Get('random')
  @ApiOperation({ summary: 'Get random questions' })
  @ApiQuery({ name: 'count', required: true, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: QuestionType })
  @ApiQuery({ name: 'format', required: false, enum: QuestionFormat })
  @ApiQuery({ name: 'difficulty', required: false, enum: DifficultyLevel })
  async getRandomQuestions(
    @Query('count', ParseIntPipe) count: number,
    @Query('type') type?: QuestionType,
    @Query('format') format?: QuestionFormat,
    @Query('difficulty') difficulty?: DifficultyLevel,
  ) {
    return await this.questionService.getRandomQuestions(count, type, difficulty, format);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by ID' })
  async findQuestionById(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.findQuestionById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update question' })
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionService.updateQuestion(id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Delete question' })
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    await this.questionService.deleteQuestion(id);
    return { message: 'Question deleted successfully' };
  }

  // Categories
  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create question category' })
  async createCategory(@Body() createCategoryDto: CreateQuestionCategoryDto) {
    return await this.questionService.createCategory(createCategoryDto);
  }

  @Get('categories/all')
  @ApiOperation({ summary: 'Get all question categories' })
  async findAllCategories() {
    return await this.questionService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.findCategoryById(id);
  }

  @Put('categories/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateQuestionCategoryDto,
  ) {
    return await this.questionService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    await this.questionService.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }

  // Question Banks
  @Post('banks')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create question bank' })
  async createBank(
    @Body() createBankDto: CreateQuestionBankDto,
    @User() user: UserEntity,
  ) {
    return await this.questionService.createBank(createBankDto, user.id);
  }

  @Get('banks/all')
  @ApiOperation({ summary: 'Get all question banks' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isPublic', required: false, type: Boolean })
  async findAllBanks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('isPublic') isPublic?: boolean,
    @User() user?: UserEntity,
  ) {
    return await this.questionService.findAllBanks(page, limit, isPublic, user?.id);
  }

  @Get('banks/:id')
  @ApiOperation({ summary: 'Get question bank by ID' })
  async findBankById(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.findBankById(id);
  }

  @Put('banks/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update question bank' })
  async updateBank(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBankDto: UpdateQuestionBankDto,
  ) {
    return await this.questionService.updateBank(id, updateBankDto);
  }

  @Delete('banks/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Delete question bank' })
  async deleteBank(@Param('id', ParseIntPipe) id: number) {
    await this.questionService.deleteBank(id);
    return { message: 'Question bank deleted successfully' };
  }
}
