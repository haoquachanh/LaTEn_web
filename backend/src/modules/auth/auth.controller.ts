import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '@entities/user.entity';
import { LocalAuthGuard } from '@common/security/local.auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  test():string { return "Auth module is available"}
  
  @Post('signup')
  async singup(@Body() user: UserEntity): Promise<UserEntity> {
    return this.authService.singup(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}