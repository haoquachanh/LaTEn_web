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
import { QandAQuestion } from './qanda-question.entity';

@Entity('qanda_answers')
export class QandAAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => QandAQuestion, (question) => question.answers)
  @JoinColumn({ name: 'questionId' })
  question: QandAQuestion;

  @Column()
  questionId: number;

  @ManyToOne(() => UserEntity, (user) => user.qandaAnswers)
  @JoinColumn({ name: 'userId' })
  author: UserEntity;

  @Column()
  userId: number;
}
