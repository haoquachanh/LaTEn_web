import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum CommentType {
  GENERAL = 'general',
  QUESTION = 'question',
  FEEDBACK = 'feedback',
  HELP_REQUEST = 'help_request',
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: CommentType, default: CommentType.GENERAL })
  type: CommentType;

  @Column({ type: 'varchar', nullable: true })
  relatedEntityType: string; // 'examination', 'course', 'lesson', etc.

  @Column({ type: 'int', nullable: true })
  relatedEntityId: number;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  dislikes: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @OneToMany('CommentReply', 'comment')
  replies: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
