import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { QandAQuestion } from './qanda-question.entity';

@Entity('qanda_question_likes')
export class QandAQuestionLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  questionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => QandAQuestion)
  @JoinColumn({ name: 'questionId' })
  question: QandAQuestion;
}
