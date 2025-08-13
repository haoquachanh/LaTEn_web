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
  Index,
} from 'typeorm';
import { QuestionCategory } from './question-category.entity';
import { UserEntity } from './user.entity';
import { Question } from './question.entity';
import { DifficultyLevel } from '@common/typings/question-type.enum';

/**
 * Entity chứa mẫu bài thi có sẵn (preset examination)
 * Khác với ExaminationTemplate, entity này chứa bài thi có nội dung cụ thể được chuẩn bị sẵn
 * Bao gồm các câu hỏi cụ thể, không phải tự động sinh từ bộ lọc
 */
@Entity('examination_presets')
@Index(['isActive', 'level']) // Tối ưu cho việc filter
@Index(['createdAt']) // Hỗ trợ sorting theo thời gian tạo
@Index(['title']) // Hỗ trợ tìm kiếm theo tiêu đề
export class ExaminationPreset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50, nullable: true })
  type: string;

  @Column('varchar', { length: 50, nullable: true })
  content: string;

  @Column('varchar', { length: 50, nullable: true })
  level: string;

  @Column('int')
  totalQuestions: number;

  @Column('int')
  durationSeconds: number;

  @Column('jsonb', { nullable: true })
  config: {
    randomize?: boolean;
    showCorrectAnswers?: boolean;
    passingScore?: number;
    resultDisplay?: {
      showImmediately?: boolean; // Hiển thị kết quả ngay sau khi nộp
      showCorrectAnswers?: boolean; // Hiển thị đáp án đúng hay không
      showExplanation?: boolean; // Hiển thị giải thích đáp án
      showScoreBreakdown?: boolean; // Hiển thị điểm chi tiết từng câu
    };
    security?: {
      preventCopy?: boolean; // Ngăn copy-paste
      preventTabSwitch?: boolean; // Phát hiện chuyển tab
      timeoutWarning?: number; // Cảnh báo khi sắp hết giờ (phút)
      shuffleOptions?: boolean; // Xáo trộn thứ tự các lựa chọn
    };
  };

  @ManyToMany(() => Question)
  @JoinTable({
    name: 'examination_preset_questions',
    joinColumn: { name: 'presetId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'questionId', referencedColumnName: 'id' },
  })
  questions: Question[];

  @ManyToMany(() => QuestionCategory)
  @JoinTable({
    name: 'examination_preset_categories',
    joinColumn: { name: 'presetId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: QuestionCategory[];

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isPublic: boolean; // Bài thi có phải là công khai hay không

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdById' })
  createdBy: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper method để kiểm tra xem một người dùng có quyền chỉnh sửa không
  canEditBy(userId: number): boolean {
    return this.createdBy?.id === userId;
  }

  // Helper method để chuyển đổi thời gian từ giây sang phút cho frontend
  getTimeInMinutes(): number {
    return Math.ceil(this.durationSeconds / 60);
  }

  // Helper method để kiểm tra xem một câu hỏi có trong preset không
  hasQuestion(questionId: number): boolean {
    return this.questions?.some((q) => q.id === questionId) || false;
  }
}
