import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExaminationQuestion } from './examination-question.entity';
import { QuestionOption } from './question-option.entity';

@Entity('examination_answers')
export class ExaminationAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExaminationQuestion, (examinationQuestion) => examinationQuestion.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'examinationQuestionId' })
  examinationQuestion: ExaminationQuestion;

  @Column('text', { nullable: true })
  answerText: string; // For short answer questions

  @ManyToOne(() => QuestionOption, { nullable: true })
  @JoinColumn({ name: 'selectedOptionId' })
  selectedOption: QuestionOption; // For multiple choice and true/false questions

  @Column('boolean', { default: false })
  isCorrect: boolean;
}
