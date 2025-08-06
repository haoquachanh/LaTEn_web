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
import { DifficultyLevel, QuestionMode, QuestionType } from '@common/typings/question-type.enum';
import { QuestionOption } from './question-option.entity';
import { ExaminationQuestion } from './examination-question.entity';

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

  @Column({ type: 'enum', enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  difficultyLevel?: DifficultyLevel;

  @Column('text', { nullable: true })
  explanation: string;

  @Column('text', { nullable: true })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true })
  audioUrl: string; // For listening questions

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdById' })
  createdBy: UserEntity;

  @OneToMany(() => QuestionOption, (o) => o.question, { cascade: true })
  options: QuestionOption[];

  @OneToMany(() => ExaminationQuestion, (e) => e.question)
  examinationQuestions: ExaminationQuestion[];

  @ManyToOne(() => QuestionCategory, (category) => category.questions, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: QuestionCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
