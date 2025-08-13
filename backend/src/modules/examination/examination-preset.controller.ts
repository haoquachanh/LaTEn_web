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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ExaminationPresetService } from './examination-preset.service';
import { CreatePresetDto, UpdatePresetDto } from './dtos/preset-dto';
import { PaginationDto } from './dtos/pagination.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('examination-presets')
@Controller('examination/presets')
export class ExaminationPresetController {
  constructor(private readonly presetService: ExaminationPresetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new examination preset' })
  @ApiResponse({ status: 201, description: 'Preset created successfully' })
  async create(@Body() createPresetDto: CreatePresetDto, @CurrentUser() user: any) {
    return this.presetService.create(createPresetDto, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an examination preset' })
  @ApiResponse({ status: 200, description: 'Preset updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePresetDto: UpdatePresetDto,
    @CurrentUser() user: any,
  ) {
    return this.presetService.update(id, updatePresetDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an examination preset' })
  @ApiResponse({ status: 204, description: 'Preset deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.presetService.delete(id, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get examination preset by ID' })
  @ApiResponse({ status: 200, description: 'Preset found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.presetService.findById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all examination presets' })
  @ApiResponse({ status: 200, description: 'Presets found' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('search') search?: string,
    @Query('level') level?: string,
    @Query('isActive') isActive?: boolean,
    @Query('isPublic') isPublic?: boolean,
    @CurrentUser() user?: any,
  ) {
    return this.presetService.findAll({
      search,
      level,
      isActive,
      isPublic,
      createdById: user?.id,
      pagination,
    });
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start an examination from a preset' })
  @ApiResponse({ status: 201, description: 'Examination started' })
  async startExamination(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.presetService.startExamination(id, user.id);
  }

  @Get('user/my-presets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get presets created by current user' })
  @ApiResponse({ status: 200, description: 'User presets found' })
  async getUserPresets(@Query() pagination: PaginationDto, @CurrentUser() user: any) {
    return this.presetService.getUserPresets(user.id, pagination);
  }

  @Get('public/available')
  @ApiOperation({ summary: 'Get all public presets' })
  @ApiResponse({ status: 200, description: 'Public presets found' })
  async getPublicPresets(@Query() pagination: PaginationDto) {
    return this.presetService.getPublicPresets(pagination);
  }

  @Post(':id/clone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clone an examination preset' })
  @ApiResponse({ status: 201, description: 'Preset cloned successfully' })
  async clonePreset(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.presetService.clonePreset(id, user.id);
  }

  @Put(':id/result-display')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update result display configuration' })
  @ApiResponse({ status: 200, description: 'Result display config updated' })
  async updateResultDisplayConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() config: any,
    @CurrentUser() user: any,
  ) {
    return this.presetService.updateResultDisplayConfig(id, config, user.id);
  }

  @Put(':id/security')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update security configuration' })
  @ApiResponse({ status: 200, description: 'Security config updated' })
  async updateSecurityConfig(@Param('id', ParseIntPipe) id: number, @Body() config: any, @CurrentUser() user: any) {
    return this.presetService.updateSecurityConfig(id, config, user.id);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get statistics for a preset' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getPresetStats(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.presetService.getPresetStats(id, user.id);
  }
}
