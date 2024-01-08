import { UserRole } from '@common/typings/user-role.enum';
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @IsOptional()
  @IsString()
  @Column({nullable: true})
  phone: string;

  @IsOptional()
  @IsString()
  @Column({nullable: true})
  fullname: string;

  @IsOptional()
  @IsString()
  @Column({nullable: true})
  birth: string;

  @IsEmpty()
  @CreateDateColumn()
  created: Date;

  @IsEmpty()
  @UpdateDateColumn()
  updated: Date;
}
