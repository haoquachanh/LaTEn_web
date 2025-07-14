import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Comment } from './comment.entity';

@Entity('comment_replies')
export class CommentReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  dislikes: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
