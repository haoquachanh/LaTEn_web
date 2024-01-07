import { Controller, Get } from '@nestjs/common';

@Controller('api/user')
export class UserController {
  @Get('test')
  findAll(): string {
    return 'The action 2';
  }
}
