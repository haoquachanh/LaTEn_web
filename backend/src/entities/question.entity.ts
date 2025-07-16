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
import { ExaminationEntity } from './examination.entity';
import { QuestionCategory } from './question-category.entity';
import { QuestionBank } from './question-bank.entity';

export enum QuestionType {
  TRUE_FALSE = 'true_false',
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
}

export enum QuestionFormat {
  READING = 'reading',
  LISTENING = 'listening',
}

export enum DifficultyLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEVEL_5 = 5,
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'enum', enum: QuestionFormat })
  format: QuestionFormat;

  @Column({ type: 'enum', enum: DifficultyLevel })
  difficulty: DifficultyLevel;

  @Column({ type: 'json', nullable: true })
  options: string[]; // For multiple choice questions

  @Column({ type: 'text', nullable: true })
  correctAnswer: string;

  @Column({ type: 'json', nullable: true })
  acceptableAnswers: string[]; // For short answer questions with multiple acceptable answers

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'int', default: 1 })
  points: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  audioUrl: string;

  @Column({ type: 'text', nullable: true })
  passage: string; // For reading comprehension questions

  @Column({ type: 'int', nullable: true })
  timeLimit: number; // Time limit in seconds for this specific question

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>; // Additional question-specific data

  @ManyToOne(() => ExaminationEntity, (examination) => examination.questions)
  @JoinColumn({ name: 'examinationId' })
  examination: ExaminationEntity;

  @ManyToOne(() => QuestionCategory, (category) => category.questions, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: QuestionCategory;

  @ManyToOne(() => QuestionBank, (bank) => bank.questions, { nullable: true })
  @JoinColumn({ name: 'questionBankId' })
  questionBank: QuestionBank;

  @OneToMany('Answer', 'question')
  answers: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
