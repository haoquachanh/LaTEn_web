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
import { QuestionCategory } from './question-category.entity';

export enum QuestionType {
  TRUE_FALSE = 'true_false',
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
}

export enum QuestionMode {
  READING = 'reading',
  LISTENING = 'listening',
}

export enum QuestionFormat {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  READING = 'reading',
  LISTENING = 'listening',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4',
  LEVEL_5 = 'level_5',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'enum', enum: QuestionMode })
  mode: QuestionMode;

  @Column({ type: 'enum', enum: QuestionFormat, default: QuestionFormat.TEXT })
  format: QuestionFormat;

  @Column({ type: 'enum', enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  difficultyLevel: DifficultyLevel;

  @Column('text', { nullable: true })
  explanation: string;

  @Column('text', { nullable: true })
  correctAnswer: string;

  @Column('simple-array', { nullable: true })
  acceptableAnswers: string[];

  @Column('int', { default: 1 })
  points: number;

  @Column({ type: 'text', nullable: true })
  audioUrl: string; // For listening questions

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdById' })
  createdBy: UserEntity;

  @OneToMany('QuestionOption', 'question')
  options: any[];

  @OneToMany('ExaminationQuestion', 'question')
  examinationQuestions: any[];

  @ManyToOne(() => QuestionCategory, (category) => category.questions, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: QuestionCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
