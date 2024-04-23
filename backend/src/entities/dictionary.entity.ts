import { WordType } from 'src/common/typings/word-type.enum';
import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('dictionary')
export class DictionaryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  word: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  definition: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(WordType)
  @Column({ type: 'simple-enum', enum: WordType, default: WordType.NONE })
  type: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  example: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  source: string;

  @IsEmpty()
  @CreateDateColumn()
  created: Date;

  @IsEmpty()
  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(() => UserEntity, (user) => user.favoriteWords)
  favoriteBy: UserEntity[];
}
