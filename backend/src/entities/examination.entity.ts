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
import { QuestionType, QuestionMode, DifficultyLevel } from './question.entity';
import { ExaminationQuestion } from './examination-question.entity';

@Entity('examinations')
export class Examination {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.examinations)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'enum', enum: QuestionType })
  questionType: QuestionType;

  @Column({ type: 'enum', enum: QuestionMode })
  mode: QuestionMode;

  @Column('int')
  totalQuestions: number;

  @Column('int', { default: 0 })
  correctAnswers: number;

  @Column('int')
  durationSeconds: number;

  @Column('timestamp')
  startedAt: Date;

  @Column('timestamp', { nullable: true })
  completedAt: Date;

  @Column('varchar', { length: 255, nullable: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'enum', enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  difficultyLevel: DifficultyLevel;

  @Column('boolean', { default: false })
  isPreset: boolean;

  @Column('int', { nullable: true })
  presetExaminationId: number;

  @ManyToOne(() => Examination, { nullable: true })
  @JoinColumn({ name: 'presetExaminationId' })
  presetExamination: Examination;

  @Column('float', { default: 0 })
  score: number;

  @Column('int', { default: 0 })
  timeSpent: number;

  @OneToMany(() => ExaminationQuestion, (examQuestion) => examQuestion.examination)
  examinationQuestions: ExaminationQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
