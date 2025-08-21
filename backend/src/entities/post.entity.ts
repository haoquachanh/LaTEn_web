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
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentReply } from './comment-reply.entity';
import { Comment } from './comment.entity';
import { PostTag } from './post-tag.entity';

export enum PostType {
  REGULAR = 'regular',
  QUESTION = 'question',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true, type: 'text' })
  fullContent: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.REGULAR,
  })
  type: PostType;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  author: UserEntity;

  @Column()
  userId: number;

  // Các comment sẽ được truy vấn riêng biệt dựa vào type và targetId
  comments: Comment[];

  @ManyToMany(() => PostTag)
  @JoinTable({
    name: 'post_tags_relation',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: PostTag[];
}
