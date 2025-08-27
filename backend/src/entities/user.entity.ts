import { UserRole } from '../common/typings/user-role.enum';
import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ unique: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Exclude()
  @Column()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  phone: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  fullname: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  birth: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  refreshToken?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  refreshTokenExpires?: Date;

  @OneToMany('Examination', 'user')
  examinations: any[];

  @OneToMany('Question', 'createdBy')
  questions: any[];

  @OneToMany('Post', 'author')
  posts: any[];

  @OneToMany('QandAQuestion', 'author')
  qandaQuestions: any[];

  @OneToMany('QandAAnswer', 'author')
  qandaAnswers: any[];
}
