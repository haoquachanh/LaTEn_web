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
import { RolesGuard } from '@common/security/role.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { UserRole } from '../../common/typings/user-role.enum';
import { Examination } from '@entities/examination.entity';
import { QuestionType, QuestionMode } from '@entities/question.entity';
import { CreateExaminationDto, UpdateExaminationDto, PresetExaminationDto } from './dtos/examination.dto';
import { SubmitExaminationDto } from './dtos/submit-examination.dto';
import { StartExaminationDto } from './dtos/start-examination.dto';

@Controller('examinations')
@UseGuards(JwtAuthGuard)
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

  @Get('my')
  async getMyExaminations(@Request() req) {
    return this.examinationService.getUserExaminations(req.user.id);
  }

  @Get('presets')
  async getPresetExaminations() {
    return this.examinationService.getPresetExaminations();
  }

  @Get('results/my')
  async getUserResults(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.examinationService.getUserResults(req.user.id, page, limit);
  }

  @Get(':id/results')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async getExaminationResults(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.examinationService.getExaminationResults(id, page, limit);
  }

  @Get('results/:id')
  async getResultById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.examinationService.getResultById(id, req.user.id);
  }

  @Get('type/:type')
  async getExaminationsByType(
    @Param('type') type: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.examinationService.getExaminationsByType(type as QuestionType, page, limit);
  }

  @Get('level/:level')
  async getExaminationsByLevel(
    @Param('level') level: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.examinationService.getExaminationsByLevel(level, page, limit);
  }

  @Get(':id')
  async getExaminationById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.examinationService.getExaminationById(id, req.user.id);
  }

  @Get()
  async getAllExaminations(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type?: QuestionType,
    @Query('mode') mode?: QuestionMode,
  ) {
    return this.examinationService.getAllExaminations(page, limit, type, mode);
  }

  @Post(':id/start')
  async startExamination(
    @Param('id', ParseIntPipe) id: number, 
    @Body() startExaminationDto: StartExaminationDto,
    @Request() req
  ) {
    return this.examinationService.startExamination(id, req.user.id, startExaminationDto);
  }

  @Post(':id/submit')
  async submitExamination(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) submitData: SubmitExaminationDto,
    @Request() req,
  ) {
    return this.examinationService.submitExamination(id, submitData, req.user.id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async createExamination(@Body(ValidationPipe) createExaminationDto: CreateExaminationDto) {
    return this.examinationService.createExamination(createExaminationDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async updateExamination(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateExaminationDto: UpdateExaminationDto,
  ) {
    return this.examinationService.updateExamination(id, updateExaminationDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async deleteExamination(@Param('id', ParseIntPipe) id: number) {
    await this.examinationService.deleteExamination(id);
    return { message: 'Examination deleted successfully' };
  }
}
