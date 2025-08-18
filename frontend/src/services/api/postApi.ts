import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../apiClient';

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  fullContent?: string;
  imageUrl?: string;
  type: string;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    fullname: string;
    username: string;
    email: string;
  };
  tags: Array<{
    id: number;
    name: string;
  }>;
  commentCount: number;
}

export interface PostDetailResponse extends PostResponse {
  comments: Array<{
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
      id: number;
      fullname: string;
      username: string;
      email: string;
    };
    replies?: Array<{
      id: number;
      content: string;
      createdAt: Date;
      author: {
        id: number;
        fullname: string;
        username: string;
        email: string;
      };
    }>;
  }>;
}

export interface PaginatedPostsResponse {
  items: PostResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  fullContent?: string;
  imageUrl?: string;
  type?: 'regular' | 'question';
  tagIds?: number[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  fullContent?: string;
  imageUrl?: string;
  type?: 'regular' | 'question';
  tagIds?: number[];
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  type?: 'regular' | 'question';
  tagId?: number;
  search?: string;
}

export interface TagResponse {
  id: number;
  name: string;
  description?: string;
  postCount?: number;
}

export interface CreateTagRequest {
  name: string;
  description?: string;
}

export const postApi = {
  getPosts: async (params?: GetPostsParams): Promise<PaginatedPostsResponse> => {
    const response = await apiClient.get('/posts', { params });
    return response.data.data;
  },

  getPostById: async (id: number): Promise<PostDetailResponse> => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data.data;
  },

  createPost: async (data: CreatePostRequest): Promise<PostResponse> => {
    const response = await apiClient.post('/posts', data);
    return response.data.data;
  },

  updatePost: async (id: number, data: UpdatePostRequest): Promise<PostResponse> => {
    const response = await apiClient.patch(`/posts/${id}`, data);
    return response.data.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },

  likePost: async (id: number): Promise<{ likes: number }> => {
    const response = await apiClient.post(`/posts/${id}/like`);
    return response.data.data;
  },

  getTags: async (): Promise<TagResponse[]> => {
    const response = await apiClient.get('/posts/tags');
    return response.data.data;
  },

  createTag: async (data: CreateTagRequest): Promise<TagResponse> => {
    const response = await apiClient.post('/posts/tags', data);
    return response.data.data;
  },
};
