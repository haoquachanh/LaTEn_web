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
import { DifficultyLevel } from '@common/typings/question-type.enum';

@Entity('examination_templates')
@Index(['isActive', 'type', 'level']) // Tối ưu cho việc filter
@Index(['createdAt']) // Hỗ trợ sorting theo thời gian tạo
@Index(['title']) // Hỗ trợ tìm kiếm theo tiêu đề
export class ExaminationTemplate {
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
    questionFilters?: {
      categories?: number[];
      difficultyLevels?: DifficultyLevel[];
      types?: string[];
    };
    categoriesDistribution?: {
      categoryId: number;
      count: number;
    }[];
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

  @Column('simple-array', { nullable: true })
  questionIds: number[];

  @Column('boolean', { default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdById' })
  createdBy: UserEntity;

  @ManyToMany(() => QuestionCategory)
  @JoinTable({
    name: 'examination_template_categories',
    joinColumn: { name: 'templateId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: QuestionCategory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper method để kiểm tra xem một người dùng có quyền chỉnh sửa template này không
  canEditBy(userId: number): boolean {
    return this.createdBy?.id === userId;
  }

  // Helper method để chuyển đổi thời gian từ giây sang phút cho frontend
  getTimeInMinutes(): number {
    return Math.ceil(this.durationSeconds / 60);
  }

  // Helper method để lấy random questions theo config
  getRandomQuestionIds(availableQuestionIds: number[]): number[] {
    if (this.questionIds && this.questionIds.length > 0) {
      return this.questionIds;
    }

    // Sử dụng Fisher-Yates shuffle algorithm cho kết quả ngẫu nhiên thực sự
    const shuffled = this.shuffleArray([...availableQuestionIds]);
    return shuffled.slice(0, this.totalQuestions);
  }

  // Fisher-Yates shuffle algorithm để tránh bias
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
