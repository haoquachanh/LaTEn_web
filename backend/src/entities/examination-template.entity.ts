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
  questionFilters: {
    categories?: number[];
    difficultyLevels?: DifficultyLevel[];
    types?: string[];
  };

  @Column('jsonb', { nullable: true })
  config: {
    randomize?: boolean;
    showCorrectAnswers?: boolean;
    passingScore?: number;
    categoriesDistribution?: {
      categoryId: number;
      count: number;
    }[];
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
}
