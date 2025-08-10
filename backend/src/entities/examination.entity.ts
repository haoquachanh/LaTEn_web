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
import { ExaminationQuestion } from './examination-question.entity';
import { ExaminationStatus } from './enums/examination-status.enum';
@Entity('examinations')
export class Examination {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.examinations)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

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

  @Column('float', { default: 0 })
  score: number;

  @Column('enum', { enum: ExaminationStatus, default: ExaminationStatus.CREATED })
  status: ExaminationStatus;

  @Column('text', { nullable: true })
  feedback: string;

  @OneToMany(() => ExaminationQuestion, (examQuestion) => examQuestion.examination)
  examinationQuestions: ExaminationQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
