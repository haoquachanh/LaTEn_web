import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserEntity } from '@entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtAuthGuard } from '@common/security/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{ access_token: string; user: Partial<UserEntity> }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() credentials: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string; user: Partial<UserEntity> }> {
    return this.authService.login(credentials);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req, @Res() response: Response): Promise<void> {
    await this.authService.logout(req.user.id);
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh', // Chỉ clear cookie cho path refresh
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<Partial<UserEntity>> {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req): Promise<{ access_token: string }> {
    return this.authService.refreshToken(req.user);
  }
}
