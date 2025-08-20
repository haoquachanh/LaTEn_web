import { Body, Controller, Post, Put, Get, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserEntity } from '../../../entities/user.entity';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PaginationParams } from '../../../common/typings/pagination-params';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  async create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: UserEntity) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  async findAll(@Query() paginationParams: PaginationParams) {
    return this.postService.findAll(paginationParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @CurrentUser() user: UserEntity) {
    return this.postService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.postService.remove(id, user);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts by user id' })
  async findByUser(@Param('userId') userId: string, @Query() paginationParams: PaginationParams) {
    return this.postService.findByUser(userId, paginationParams);
  }

  @Get('tag/:tag')
  @ApiOperation({ summary: 'Get posts by tag' })
  async findByTag(@Param('tag') tag: string, @Query() paginationParams: PaginationParams) {
    return this.postService.findByTag(tag, paginationParams);
  }
}
