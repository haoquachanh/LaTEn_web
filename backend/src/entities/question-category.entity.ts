import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  Index,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_categories')
@Index(['name']) // Hỗ trợ tìm kiếm theo tên
export class QuestionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', nullable: true })
  parentId: number; // Hỗ trợ cấu trúc phân cấp cho danh mục

  @ManyToMany(() => Question, (question) => question.categories)
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
