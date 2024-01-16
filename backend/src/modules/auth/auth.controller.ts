import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '@entities/user.entity';
import { LocalAuthGuard } from '@common/security/local.auth.guard';
import { FormatData } from '@common/decorators/format-res.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')

  test(@FormatData() data:any):string { return data //"Auth module is available"
  }
  
  @Post('register')
  async register(@Body() user: UserEntity): Promise<UserEntity> {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}