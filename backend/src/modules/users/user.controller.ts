import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  // UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from '@entities/user.entity';
// import { JwtAuthGuard } from '@common/security/jwt.auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('test')
  test(): string {
    return 'User api is available';
  }

  @Get()
  async getAll(): Promise<any> {
    return this.userService.getAllUsers();
  }

  @Post()
  async create(@Body() user: UserEntity): Promise<UserEntity> {
    return this.userService.create(user);
  }

  @Put(':id')
  async update(
    @Body() user: UserEntity,
    @Param('id') id: string,
  ): Promise<UpdateResult> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.delete(id);
  }

  @Post(':id/favorite-words')
  async favorite(
    @Body() body: { wordId: number },
    @Param('id') userId: string,
  ): Promise<void> {
    return this.userService.addToFavorite(parseInt(userId), body.wordId);
  }
}
