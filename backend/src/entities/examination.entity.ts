import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum ExaminationType {
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  LISTENING = 'listening',
  READING = 'reading',
  MIXED = 'mixed',
}

export enum ExaminationLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Entity('examinations')
export class ExaminationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ExaminationType })
  type: ExaminationType;

  @Column({ type: 'enum', enum: ExaminationLevel })
  level: ExaminationLevel;

  @Column({ type: 'int', default: 60 })
  duration: number; // in minutes

  @Column({ type: 'int', default: 10 })
  totalQuestions: number;

  @Column({ type: 'float', default: 0 })
  passingScore: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserEntity;

  @OneToMany('Question', 'examination')
  questions: any[];

  @OneToMany('ExaminationResult', 'examination')
  results: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
