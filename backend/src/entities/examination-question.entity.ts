import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { Examination } from './examination.entity';
import { Question } from './question.entity';

@Unique(['examination', 'question'])
@Entity('examination_questions')
export class ExaminationQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Examination, (examination) => examination.examinationQuestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examinationId' })
  examination: Examination;

  @ManyToOne(() => Question, (question) => question.examinationQuestions)
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @Column({ type: 'text', nullable: true })
  userAnswer: string;

  @Column({ type: 'boolean', nullable: true })
  isCorrect: boolean;

  @Column({ type: 'integer', default: 0 })
  orderIndex: number; // Thứ tự hiển thị câu hỏi trong bài thi

  @Column({ type: 'jsonb', nullable: true })
  optionsOrder: number[]; // Thứ tự hiển thị các lựa chọn

  @Column({ type: 'text', nullable: true })
  feedback: string; // Phản hồi cho câu trả lời

  @Column({ type: 'float', default: 0 })
  score: number; // Điểm số đạt được cho câu hỏi
}
