import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';

/**
 * UserScore entity to track user scores for leaderboard
 * This maintains a record of users' aggregated scores over different time periods
 */
@Entity('user_scores')
export class UserScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @Index()
  user: UserEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  score: number;

  @Column({ default: 0 })
  examCount: number;

  @Column({ default: 0 })
  totalCorrectAnswers: number;

  @Column({ default: 0 })
  totalQuestions: number;

  @Column({ type: 'varchar', length: 20 })
  @Index()
  timeFrame: 'all' | 'month' | 'week' | 'day';

  @Column({ type: 'varchar', length: 7, nullable: true })
  @Index()
  yearMonth: string; // Format: YYYY-MM for monthly scores

  @Column({ type: 'varchar', length: 10, nullable: true })
  @Index()
  yearWeek: string; // Format: YYYY-WW for weekly scores

  @Column({ type: 'date', nullable: true })
  @Index()
  date: Date; // For daily scores

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
