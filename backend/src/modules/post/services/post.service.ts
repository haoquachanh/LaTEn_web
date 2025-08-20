import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../../entities/post.entity';
import { UserEntity } from '../../../entities/user.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PaginationParams } from '../../../common/typings/pagination-params';
import { PostTag } from '../../../entities/post-tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostTag)
    private tagRepository: Repository<PostTag>,
  ) {}

  async create(createPostDto: CreatePostDto, user: UserEntity): Promise<Post> {
    const post = new Post();
    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.fullContent = createPostDto.fullContent || createPostDto.content;
    post.imageUrl = createPostDto.coverImage;
    post.userId = user.id;
    post.isActive = true;

    // Handle tags
    if (createPostDto.tags?.length) {
      const tags = await this.getOrCreateTags(createPostDto.tags);
      post.tags = tags;
    }

    return this.postRepository.save(post);
  }

  async findAll(paginationParams: PaginationParams) {
    const { page = 1, limit = 10 } = paginationParams;
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      where: { isActive: true },
      relations: ['author', 'tags'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: +id, isActive: true },
      relations: ['author', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment view count
    post.views += 1;
    await this.postRepository.save(post);

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: UserEntity): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: +id },
      relations: ['author', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to update this post');
    }

    // Update post fields
    if (updatePostDto.title) post.title = updatePostDto.title;
    if (updatePostDto.content) post.content = updatePostDto.content;
    if (updatePostDto.fullContent) post.fullContent = updatePostDto.fullContent;
    if (updatePostDto.coverImage) post.imageUrl = updatePostDto.coverImage;

    // Handle tags
    if (updatePostDto.tags?.length) {
      const tags = await this.getOrCreateTags(updatePostDto.tags);
      post.tags = tags;
    }

    return this.postRepository.save(post);
  }

  async remove(id: string, user: UserEntity): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: +id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You are not authorized to delete this post');
    }

    // Soft delete - just mark as inactive
    post.isActive = false;
    await this.postRepository.save(post);
  }

  async findByUser(userId: string, paginationParams: PaginationParams) {
    const { page = 1, limit = 10 } = paginationParams;
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      where: { userId: +userId, isActive: true },
      relations: ['author', 'tags'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByTag(tagName: string, paginationParams: PaginationParams) {
    const { page = 1, limit = 10 } = paginationParams;
    const skip = (page - 1) * limit;

    const tag = await this.tagRepository.findOne({
      where: { name: tagName },
    });

    if (!tag) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    const [posts, total] = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.tags', 'tag')
      .where('tag.id = :tagId', { tagId: tag.id })
      .andWhere('post.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async getOrCreateTags(tagNames: string[]): Promise<PostTag[]> {
    const tags: PostTag[] = [];

    for (const name of tagNames) {
      let tag = await this.tagRepository.findOne({ where: { name } });

      if (!tag) {
        tag = new PostTag();
        tag.name = name;
        tag = await this.tagRepository.save(tag);
      }

      tags.push(tag);
    }

    return tags;
  }
}
