import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDto } from '@modules/auth/dtos/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(credentials: LoginDto): Promise<any> {
    const foundUser = await this.authService.validateUser(credentials);
    if (!foundUser) throw new UnauthorizedException();
    return foundUser;
  }
}
