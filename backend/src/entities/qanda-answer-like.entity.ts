import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { QandAAnswer } from './qanda-answer.entity';

@Entity('qanda_answer_likes')
export class QandAAnswerLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  answerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => QandAAnswer)
  @JoinColumn({ name: 'answerId' })
  answer: QandAAnswer;
}
