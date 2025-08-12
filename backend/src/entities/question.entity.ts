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
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestionCategory } from './question-category.entity';
import { DifficultyLevel, QuestionMode, QuestionType } from '@common/typings/question-type.enum';
import { QuestionOption } from './question-option.entity';
import { ExaminationQuestion } from './examination-question.entity';
import { QuestionBank } from './question-bank.entity';

@Entity('questions')
@Index(['type', 'difficultyLevel']) // Thêm index cho các trường thường dùng để filter
@Index(['createdAt']) // Hỗ trợ sorting
@Index(['mode']) // Hỗ trợ filter theo reading/listening
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'enum', enum: QuestionMode })
  mode: QuestionMode;

  @Column({ type: 'enum', enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  difficultyLevel?: DifficultyLevel;

  @Column('text', { nullable: true })
  explanation: string;

  @Column('text', { nullable: true })
  correctAnswer: string;

  @Column({ type: 'text', nullable: true })
  audioUrl: string; // For listening questions

  @Column({ type: 'integer', default: 1 })
  points: number; // Điểm cho mỗi câu hỏi

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Trạng thái active để filter

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // Metadata bổ sung cho câu hỏi

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdById' })
  createdBy: UserEntity;

  @OneToMany(() => QuestionOption, (o) => o.question, { cascade: true, eager: true })
  options: QuestionOption[];

  @OneToMany(() => ExaminationQuestion, (e) => e.question)
  examinationQuestions: ExaminationQuestion[];

  @ManyToMany(() => QuestionCategory)
  @JoinTable({
    name: 'question_categories_relations',
    joinColumn: { name: 'questionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: QuestionCategory[];

  @ManyToMany(() => QuestionBank, (bank) => bank.questions)
  banks: QuestionBank[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Phương thức trợ giúp để kiểm tra câu trả lời có đúng không
  checkAnswer(userAnswer: string): boolean {
    if (!userAnswer) return false;

    switch (this.type) {
      case QuestionType.TRUE_FALSE:
      case QuestionType.MULTIPLE_CHOICE:
        return userAnswer === this.correctAnswer;
      case QuestionType.SHORT_ANSWER:
        // Có thể thêm logic so sánh tương đối cho câu trả lời ngắn
        return userAnswer.toLowerCase().trim() === this.correctAnswer.toLowerCase().trim();
      case QuestionType.ESSAY:
        // Câu essay cần giáo viên chấm điểm thủ công
        return false;
      default:
        return false;
    }
  }

  // Hàm trả về điểm của câu hỏi dựa vào độ khó
  getPoints(): number {
    if (this.points) return this.points;

    // Mặc định điểm theo độ khó nếu không có điểm được gán
    switch (this.difficultyLevel) {
      case DifficultyLevel.EASY:
        return 1;
      case DifficultyLevel.MEDIUM:
        return 2;
      case DifficultyLevel.HARD:
        return 3;
      case DifficultyLevel.EXPERT:
        return 5;
      default:
        return 1;
    }
  }
}
