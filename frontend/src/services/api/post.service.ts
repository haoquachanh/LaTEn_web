import { getSession } from '@/services/session';
import { API_BASE_URL } from '@/config/apiRoutes';

export interface Author {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  postCount?: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  fullContent?: string;
  imageUrl?: string;
  type: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
  commentCount: number;
  isLikedByCurrentUser?: boolean;
}

export interface Reply {
  id: number;
  content: string;
  createdAt: string;
  author: Author;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  replies: Reply[];
}

export interface PostDetail extends Post {
  comments: Comment[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  type?: string;
  tagId?: number;
  search?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  fullContent?: string;
  imageUrl?: string;
  type?: string;
  tagIds?: number[];
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  fullContent?: string;
  imageUrl?: string;
  type?: string;
  tagIds?: number[];
}

class PostService {
  private async getHeaders(includeAuth: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      let token: string | null = null;

      if (typeof window !== 'undefined') {
        token = localStorage.getItem('access_token');
      }

      if (!token) {
        const session = await getSession();
        token = session?.accessToken || null;
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  }

  async getPosts(params: GetPostsParams = {}): Promise<PaginatedResponse<Post>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.type) queryParams.append('type', params.type);
    if (params.tagId) queryParams.append('tagId', params.tagId.toString());
    if (params.search) queryParams.append('search', params.search);

    const url = `${API_BASE_URL}/posts?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getHeaders(true),
    });

    return this.handleResponse<PaginatedResponse<Post>>(response);
  }

  async getPostById(id: number | string): Promise<PostDetail> {
    const url = `${API_BASE_URL}/posts/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getHeaders(true),
    });

    return this.handleResponse<PostDetail>(response);
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    const url = `${API_BASE_URL}/posts`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Post>(response);
  }

  async updatePost(id: number | string, data: UpdatePostDto): Promise<Post> {
    const url = `${API_BASE_URL}/posts/${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: await this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Post>(response);
  }

  async deletePost(id: number | string): Promise<void> {
    const url = `${API_BASE_URL}/posts/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: await this.getHeaders(true),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
    }
  }

  async likePost(id: number | string): Promise<{ likes: number; isLiked: boolean }> {
    const url = `${API_BASE_URL}/posts/${id}/like`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(true),
    });

    return this.handleResponse<{ likes: number; isLiked: boolean }>(response);
  }

  async unlikePost(id: number | string): Promise<{ likes: number; isLiked: boolean }> {
    const url = `${API_BASE_URL}/posts/${id}/like`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: await this.getHeaders(true),
    });

    return this.handleResponse<{ likes: number; isLiked: boolean }>(response);
  }

  async addComment(postId: number | string, content: string): Promise<Comment> {
    const url = `${API_BASE_URL}/posts/${postId}/comments`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(true),
      body: JSON.stringify({ content }),
    });

    return this.handleResponse<Comment>(response);
  }

  async getComments(postId: number | string): Promise<Comment[]> {
    const url = `${API_BASE_URL}/posts/${postId}/comments`;
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    return this.handleResponse<Comment[]>(response);
  }

  async getAllTags(): Promise<Tag[]> {
    const url = `${API_BASE_URL}/posts/tags`;
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    return this.handleResponse<Tag[]>(response);
  }

  async createTag(name: string, description?: string): Promise<Tag> {
    const url = `${API_BASE_URL}/posts/tags`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(true),
      body: JSON.stringify({ name, description }),
    });

    return this.handleResponse<Tag>(response);
  }
}

export const postService = new PostService();
