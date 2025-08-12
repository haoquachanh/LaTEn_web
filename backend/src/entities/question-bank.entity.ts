import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { QuestionCategory } from './question-category.entity';
import { Question } from './question.entity';
import { UserEntity } from './user.entity';

@Entity('question_banks')
export class QuestionBank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creatorId' })
  creator: UserEntity;

  // Thay đổi từ ManyToOne thành ManyToMany để một bank có thể thuộc nhiều category
  @ManyToMany(() => QuestionCategory)
  @JoinTable({
    name: 'question_bank_categories',
    joinColumn: { name: 'bank_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: QuestionCategory[];

  @ManyToMany(() => Question)
  @JoinTable({
    name: 'question_bank_questions',
    joinColumn: { name: 'bank_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'question_id', referencedColumnName: 'id' },
  })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
