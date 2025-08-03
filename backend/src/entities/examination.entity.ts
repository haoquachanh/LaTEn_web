import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestionType, QuestionMode } from './question.entity';

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

  @OneToMany('ExaminationQuestion', 'examination')
  examinationQuestions: any[];

  @CreateDateColumn()
  createdAt: Date;
}
