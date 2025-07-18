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
import { Question } from './question.entity';
import { QuestionCategory } from './question-category.entity';

@Entity('question_banks')
export class QuestionBank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  creator: UserEntity;

  @ManyToOne(() => QuestionCategory, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: QuestionCategory;

  @OneToMany(() => Question, (question) => question.questionBank)
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
