import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
  // UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from '@entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@common/security/role.guard';
import { UserRole } from '@common/typings/user-role.enum';
import { Roles } from '@common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Validate } from 'class-validator';
import { Transform, TransformPlainToInstance } from 'class-transformer';
import { User } from '@common/decorators/user.decorator';
// import { JwtAuthGuard } from '@common/security/jwt.auth.guard';
// import { RolesGuard } from '@common/security/role.guard';

@ApiTags('Users')
@Controller('user')
// @UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@User() user: { id: number }): Promise<any> {
    return this.userService.getUserById(user.id);
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async getAll(): Promise<any> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async getById(@Param('id') id: string, req: Request): Promise<UserEntity> {
    return this.userService.getUserById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(user);
  }

  @Put(':id')
  async update(
    @Body() user: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
