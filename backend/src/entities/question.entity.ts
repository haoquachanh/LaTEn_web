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

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_IN_BLANK = 'fill_in_blank',
  ESSAY = 'essay',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'json', nullable: true })
  options: string[]; // For multiple choice questions

  @Column({ type: 'text', nullable: true })
  correctAnswer: string;

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

  @ManyToOne(() => ExaminationEntity, (examination) => examination.questions)
  @JoinColumn({ name: 'examinationId' })
  examination: ExaminationEntity;

  @OneToMany('Answer', 'question')
  answers: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
