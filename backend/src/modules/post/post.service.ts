import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostType } from '../../entities/post.entity';
import { PostTag } from '../../entities/post-tag.entity';
import { UserEntity } from '../../entities/user.entity';
import { Comment, CommentType } from '../../entities/comment.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { CreateTagDto } from './dtos/create-tag.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';
import { PostResponse, PostDetailResponse } from './interfaces/post-response.interface';
import { TagResponse } from './interfaces/tag-response.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostTag)
    private tagRepository: Repository<PostTag>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto): Promise<PostResponse> {
    // Find user
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create post entity
    const post = this.postRepository.create({
      ...createPostDto,
      userId,
      author: user,
    });

    // Handle tags if provided
    if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
      const tags = await this.tagRepository.findByIds(createPostDto.tagIds);
      post.tags = tags;
    }

    // Save post
    await this.postRepository.save(post);

    // Return formatted response
    return this.formatPostResponse(post);
  }

  async getAllPosts(queryParams: GetPostsDto): Promise<PaginatedResponse<PostResponse>> {
    const { page = 1, limit = 10, type, tagId, search } = queryParams;
    const skip = (page - 1) * limit;

    // Build query
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.isActive = :isActive', { isActive: true });

    // Add filters if provided
    if (type) {
      query.andWhere('post.type = :type', { type });
    }

    if (tagId) {
      query.andWhere('tags.id = :tagId', { tagId });
    }

    if (search) {
      query.andWhere('(post.title LIKE :search OR post.content LIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Get total count for pagination
    const total = await query.getCount();

    // Get paginated posts
    const posts = await query.orderBy('post.createdAt', 'DESC').skip(skip).take(limit).getMany();

    // Get comment counts for each post
    const postsWithCommentCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await this.commentRepository.count({
          where: {
            targetId: post.id,
            type: CommentType.POST,
            isActive: true,
          },
        });

        return { ...post, commentCount };
      }),
    );

    // Format response
    const items = postsWithCommentCounts.map((post) => this.formatPostResponse(post));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPostById(id: number): Promise<PostDetailResponse> {
    const post = await this.postRepository.findOne({
      where: { id, isActive: true },
      relations: ['author', 'tags'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Lấy comments theo targetId và type
    const comments = await this.commentRepository.find({
      where: {
        targetId: post.id,
        type: CommentType.POST,
        isActive: true,
      },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'DESC' },
    });

    // Gán comments vào post
    post.comments = comments;

    // Increment view count
    post.views += 1;
    await this.postRepository.save(post);

    // Return formatted response
    return this.formatPostDetailResponse(post);
  }

  async updatePost(userId: number, postId: number, updatePostDto: UpdatePostDto): Promise<PostResponse> {
    // Get post with relations
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author', 'tags'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user is the author or an admin
    if (post.userId !== userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new BadRequestException('You do not have permission to update this post');
      }
    }

    // Update post fields
    Object.assign(post, updatePostDto);

    // Handle tags if provided
    if (updatePostDto.tagIds) {
      const tags = await this.tagRepository.findByIds(updatePostDto.tagIds);
      post.tags = tags;
    }

    // Save updated post
    await this.postRepository.save(post);

    // Return formatted response
    return this.formatPostResponse(post);
  }

  async deletePost(userId: number, postId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user is the author or an admin
    if (post.userId !== userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new BadRequestException('You do not have permission to delete this post');
      }
    }

    // Soft delete by setting isActive to false
    post.isActive = false;
    await this.postRepository.save(post);
  }

  async likePost(userId: number, postId: number): Promise<{ likes: number }> {
    const post = await this.postRepository.findOne({
      where: { id: postId, isActive: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment like count
    // In a real application, you would track which users liked which posts
    // to prevent multiple likes from the same user
    post.likes += 1;
    await this.postRepository.save(post);

    return { likes: post.likes };
  }

  // Tag management

  async createTag(createTagDto: CreateTagDto): Promise<TagResponse> {
    // Check if tag with this name already exists
    const existingTag = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });

    if (existingTag) {
      throw new BadRequestException('Tag with this name already exists');
    }

    // Create and save new tag
    const tag = this.tagRepository.create(createTagDto);
    await this.tagRepository.save(tag);

    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
    };
  }

  async getAllTags(): Promise<TagResponse[]> {
    const tags = await this.tagRepository.find({
      order: { name: 'ASC' },
    });

    // Get post count for each tag
    const tagsWithCount = await Promise.all(
      tags.map(async (tag) => {
        const postCount = await this.postRepository
          .createQueryBuilder('post')
          .innerJoin('post.tags', 'tag', 'tag.id = :tagId', { tagId: tag.id })
          .where('post.isActive = :isActive', { isActive: true })
          .getCount();

        return {
          id: tag.id,
          name: tag.name,
          description: tag.description,
          postCount,
        };
      }),
    );

    return tagsWithCount;
  }

  // Helper methods

  private formatPostResponse(post: any): PostResponse {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      fullContent: post.fullContent,
      imageUrl: post.imageUrl,
      type: post.type,
      likes: post.likes,
      views: post.views,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        fullname: post.author.fullname,
        username: post.author.username,
        email: post.author.email,
      },
      tags:
        post.tags?.map((tag) => ({
          id: tag.id,
          name: tag.name,
        })) || [],
      commentCount: post.commentCount || post.comments?.length || 0,
    };
  }

  private formatPostDetailResponse(post: Post): PostDetailResponse {
    const baseResponse = this.formatPostResponse(post);

    return {
      ...baseResponse,
      comments:
        post.comments?.map((comment) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: {
            id: comment.author.id,
            fullname: comment.author.fullname,
            username: comment.author.username,
            email: comment.author.email,
          },
          replies:
            comment.replies?.map((reply) => ({
              id: reply.id,
              content: reply.content,
              createdAt: reply.createdAt,
              author: {
                id: reply.author.id,
                fullname: reply.author.fullname,
                username: reply.author.username,
                email: reply.author.email,
              },
            })) || [],
        })) || [],
    };
  }
}
