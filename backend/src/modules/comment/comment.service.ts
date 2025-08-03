import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, CommentType } from '../../entities/comment.entity';
import { CommentReply } from '../../entities/comment-reply.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentReply)
    private readonly replyRepository: Repository<CommentReply>,
  ) {}

  async getAllComments(page: number = 1, limit: number = 10): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { isActive: true },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { comments, total };
  }

  async getCommentsByEntity(
    entityType: string,
    entityId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: {
        type: entityType as CommentType,
        targetId: entityId,
        isActive: true,
      },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { comments, total };
  }

  async getCommentsByType(
    type: CommentType,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { type, isActive: true },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { comments, total };
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id, isActive: true },
      relations: ['author', 'replies', 'replies.author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async createComment(commentData: Partial<Comment>, authorId: number): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...commentData,
      author: { id: authorId } as UserEntity,
    });

    return this.commentRepository.save(comment);
  }

  async updateComment(id: number, updateData: Partial<Comment>, userId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateData);
    return this.commentRepository.save(comment);
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    comment.isActive = false;
    await this.commentRepository.save(comment);
  }

  async likeComment(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.likes += 1;
    return this.commentRepository.save(comment);
  }

  async dislikeComment(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.dislikes += 1;
    return this.commentRepository.save(comment);
  }

  // Reply methods
  async createReply(commentId: number, replyData: Partial<CommentReply>, authorId: number): Promise<CommentReply> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const reply = this.replyRepository.create({
      ...replyData,
      comment,
      author: { id: authorId } as UserEntity,
    });

    return this.replyRepository.save(reply);
  }

  async updateReply(id: number, updateData: Partial<CommentReply>, userId: number): Promise<CommentReply> {
    const reply = await this.replyRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    if (reply.author.id !== userId) {
      throw new ForbiddenException('You can only update your own replies');
    }

    Object.assign(reply, updateData);
    return this.replyRepository.save(reply);
  }

  async deleteReply(id: number, userId: number): Promise<void> {
    const reply = await this.replyRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    if (reply.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own replies');
    }

    reply.isActive = false;
    await this.replyRepository.save(reply);
  }

  async likeReply(id: number): Promise<CommentReply> {
    const reply = await this.replyRepository.findOne({ where: { id } });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    reply.likes += 1;
    return this.replyRepository.save(reply);
  }

  async dislikeReply(id: number): Promise<CommentReply> {
    const reply = await this.replyRepository.findOne({ where: { id } });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    reply.dislikes += 1;
    return this.replyRepository.save(reply);
  }
}
