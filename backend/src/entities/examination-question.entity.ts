import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Examination } from './examination.entity';
import { Question } from './question.entity';

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

  @OneToMany('ExaminationAnswer', 'examinationQuestion')
  answers: any[];
}
