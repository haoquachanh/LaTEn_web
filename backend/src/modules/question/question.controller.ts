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
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@common/security/jwt.guard';
import { QuestionService } from './question.service';
import { RolesGuard } from '@common/security/role.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '@common/typings/user-role.enum';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { Question } from '@entities/question.entity';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { HttpCacheInterceptor } from '@common/interceptors/cache.interceptor';
import { CacheKey } from '@common/decorators/cache-key.decorator';
import { CacheTTL } from '@common/decorators/cache-ttl.decorator';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
    const user = req.user;
    return await this.questionService.create({ ...createQuestionDto, createdBy: user.id });
  }

  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey('question:list')
  @CacheTTL(1800)
  findAll(): Promise<Question[]> {
    return this.questionService.findAll();
  }

  @Get(':id')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey('question:detail')
  @CacheTTL(900)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Question> {
    return this.questionService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateQuestionDto): Promise<Question> {
    return this.questionService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.questionService.remove(id);
  }
}
