/**
 * Comment Service Types
 *
 * TypeScript interfaces and types for the comment service
 * that match the backend entity structure.
 */

/**
 * Comment types
 */
export enum CommentType {
  GENERAL = 'general',
  QUESTION = 'question',
  FEEDBACK = 'feedback',
  HELP_REQUEST = 'help_request',
}

/**
 * Entity types that can be commented on
 */
export enum EntityType {
  EXAMINATION = 'examination',
  COURSE = 'course',
  LESSON = 'lesson',
  DICTIONARY = 'dictionary',
}

/**
 * Author information
 */
export interface Author {
  id: number;
  email: string;
  fullname?: string;
}

/**
 * Comment reply interface
 */
export interface CommentReply {
  id: number;
  content: string;
  likes: number;
  dislikes: number;
  isActive: boolean;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

/**
 * Comment interface
 */
export interface Comment {
  id: number;
  content: string;
  type: CommentType;
  relatedEntityType: string;
  relatedEntityId: number;
  likes: number;
  dislikes: number;
  isActive: boolean;
  author: Author;
  replies: CommentReply[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Comment creation parameters
 */
export interface CreateCommentInput {
  entityType: string;
  entityId: number | string;
  content: string;
  type?: CommentType;
}

/**
 * Reply creation parameters
 */
export interface CreateReplyInput {
  commentId: number | string;
  content: string;
}

/**
 * Comment query parameters
 */
export interface CommentQueryParams {
  entityType: string;
  entityId: number | string;
  page?: number;
  limit?: number;
  type?: CommentType;
  sortBy?: 'createdAt' | 'likes';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Comment list response
 */
export interface CommentListResponse {
  data: Comment[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Reaction input
 */
export interface ReactionInput {
  type: 'like' | 'dislike';
}

/**
 * Reaction response
 */
export interface ReactionResponse {
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike' | null;
}
