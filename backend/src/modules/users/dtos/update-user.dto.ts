import { UserRole } from '@common/typings/user-role.enum';
import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmpty({ message: "email can't be change" })
  @IsString()
  email: string;

  @IsEmpty({ message: 'you want change password here? not good!' })
  @IsString()
  password: string;

  @IsEmpty({ message: "role can't be change" })
  role?: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  birth?: string;
}
