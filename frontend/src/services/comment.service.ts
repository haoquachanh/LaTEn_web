/**
 * Comment Service
 *
 * Enterprise-grade service for comment and reply management
 * across different entities in the application.
 */
import api from './api';
import {
  Comment,
  CommentListResponse,
  CommentQueryParams,
  CommentReply,
  CreateCommentInput,
  ReactionInput,
  ReactionResponse,
} from './types/comment.types';

/**
 * CommentService provides methods to interact with comment endpoints
 */
class CommentService {
  private basePath = '/comments';

  /**
   * Get comments for an entity
   *
   * @param params Query parameters
   * @returns Promise with paginated comment list
   */
  async getComments(params: CommentQueryParams): Promise<CommentListResponse> {
    try {
      const response = await api.get(this.basePath, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  /**
   * Create a new comment
   *
   * @param data Comment data
   * @returns Promise with created comment
   */
  async createComment(data: CreateCommentInput): Promise<Comment> {
    try {
      const response = await api.post(this.basePath, data);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  /**
   * Update an existing comment
   *
   * @param id Comment ID
   * @param content Updated content
   * @returns Promise with updated comment
   */
  async updateComment(id: number | string, content: string): Promise<Comment> {
    try {
      const response = await api.put(`${this.basePath}/${id}`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a comment
   *
   * @param id Comment ID
   * @returns Promise with success message
   */
  async deleteComment(id: number | string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add a reply to a comment
   *
   * @param commentId Comment ID
   * @param content Reply content
   * @returns Promise with created reply
   */
  async replyToComment(commentId: number | string, content: string): Promise<CommentReply> {
    try {
      const response = await api.post(`${this.basePath}/${commentId}/replies`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error replying to comment ${commentId}:`, error);
      throw error;
    }
  }

  /**
   * Update a reply
   *
   * @param commentId Comment ID
   * @param replyId Reply ID
   * @param content Updated content
   * @returns Promise with updated reply
   */
  async updateReply(commentId: number | string, replyId: number | string, content: string): Promise<CommentReply> {
    try {
      const response = await api.put(`${this.basePath}/${commentId}/replies/${replyId}`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error updating reply ${replyId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a reply
   *
   * @param commentId Comment ID
   * @param replyId Reply ID
   * @returns Promise with success message
   */
  async deleteReply(
    commentId: number | string,
    replyId: number | string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`${this.basePath}/${commentId}/replies/${replyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting reply ${replyId}:`, error);
      throw error;
    }
  }

  /**
   * React to a comment (like/dislike)
   *
   * @param commentId Comment ID
   * @param reaction Reaction type
   * @returns Promise with updated reaction counts
   */
  async reactToComment(commentId: number | string, reaction: ReactionInput): Promise<ReactionResponse> {
    try {
      const response = await api.post(`${this.basePath}/${commentId}/reactions`, reaction);
      return response.data;
    } catch (error) {
      console.error(`Error reacting to comment ${commentId}:`, error);
      throw error;
    }
  }

  /**
   * React to a reply (like/dislike)
   *
   * @param commentId Comment ID
   * @param replyId Reply ID
   * @param reaction Reaction type
   * @returns Promise with updated reaction counts
   */
  async reactToReply(
    commentId: number | string,
    replyId: number | string,
    reaction: ReactionInput,
  ): Promise<ReactionResponse> {
    try {
      const response = await api.post(`${this.basePath}/${commentId}/replies/${replyId}/reactions`, reaction);
      return response.data;
    } catch (error) {
      console.error(`Error reacting to reply ${replyId}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific comment by ID
   *
   * @param id Comment ID
   * @returns Promise with comment details
   */
  async getCommentById(id: number | string): Promise<Comment> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error);
      throw error;
    }
  }
}

const commentService = new CommentService();
export default commentService;
