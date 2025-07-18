import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ExaminationEntity } from './examination.entity';

@Entity('examination_results')
export class ExaminationResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'float' })
  percentage: number;

  @Column({ type: 'int' })
  totalQuestions: number;

  @Column({ type: 'int' })
  correctAnswers: number;

  @Column({ type: 'int' })
  timeSpent: number; // in seconds

  @Column({ default: false })
  isPassed: boolean;

  @Column({ type: 'json', nullable: true })
  detailedResults: any; // Store question-by-question results

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => ExaminationEntity, (examination) => examination.results)
  @JoinColumn({ name: 'examinationId' })
  examination: ExaminationEntity;

  @CreateDateColumn()
  completedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
