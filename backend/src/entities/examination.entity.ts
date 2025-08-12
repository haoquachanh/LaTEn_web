import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ExaminationQuestion } from './examination-question.entity';
import { ExaminationStatus } from './enums/examination-status.enum';
@Entity('examinations')
@Index(['status']) // Hỗ trợ filter theo trạng thái
@Index(['createdAt']) // Hỗ trợ sorting theo thời gian tạo
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

  @Column('int', { default: 0 })
  incorrectAnswers: number;

  @Column('int', { default: 0 })
  skippedQuestions: number;

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

  // Helper method để tính thời gian làm bài (seconds)
  getTimeSpent(): number {
    if (!this.completedAt) {
      const now = new Date();
      return Math.round((now.getTime() - this.startedAt.getTime()) / 1000);
    }
    return Math.round((this.completedAt.getTime() - this.startedAt.getTime()) / 1000);
  }

  // Helper method để tính điểm theo tỷ lệ phần trăm
  getPercentageScore(): number {
    if (!this.totalQuestions || this.totalQuestions === 0) return 0;
    return Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }

  // Helper method để kiểm tra có vượt qua bài thi không (điểm đạt > 70%)
  isPassed(): boolean {
    return this.getPercentageScore() >= 70;
  }
}
