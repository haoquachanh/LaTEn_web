import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QandAAnswer } from './qanda-answer.entity';
import { PostTag } from './post-tag.entity';

export enum QuestionCategory {
  GENERAL = 'general',
  TECHNICAL = 'technical',
  LEARNING = 'learning',
  EXAM = 'exam',
  OTHER = 'other',
}

@Entity('qanda_questions')
export class QandAQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: QuestionCategory,
    default: QuestionCategory.GENERAL,
  })
  category: QuestionCategory;

  @Column({ default: false })
  isAnswered: boolean;

  @Column({ nullable: true })
  acceptedAnswerId: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.qandaQuestions)
  @JoinColumn({ name: 'userId' })
  author: UserEntity;

  @Column()
  userId: number;

  @OneToMany(() => QandAAnswer, (answer) => answer.question)
  answers: QandAAnswer[];

  @ManyToMany(() => PostTag)
  @JoinTable({
    name: 'qanda_question_tags_relation',
    joinColumn: { name: 'questionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: PostTag[];
}
