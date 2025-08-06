import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('question_options')
export class QuestionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.options, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column('text')
  content: string;

  @Column('boolean')
  isCorrect: boolean;
}
