import { getSession } from '@/services/session';
import type { Comment, Reply, Author } from './post.service';

import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/config/apiRoutes';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

class CommentService {
  private async getHeaders(includeAuth: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      // Ưu tiên localStorage cho client-side
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Fallback to session nếu không có trong localStorage
        const session = await getSession();
        if (session?.accessToken) {
          headers['Authorization'] = `Bearer ${session.accessToken}`;
        }
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

  async addReply(commentId: number | string, content: string): Promise<Reply> {
    const url = `${API_BASE_URL}/comments/${commentId}/replies`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(true),
      body: JSON.stringify({ content }),
    });

    return this.handleResponse<Reply>(response);
  }

  async deleteComment(commentId: number | string): Promise<void> {
    const url = `${API_BASE_URL}/comments/${commentId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: await this.getHeaders(true),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
    }
  }

  async updateComment(commentId: number | string, content: string): Promise<Comment> {
    const url = `${API_BASE_URL}/comments/${commentId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: await this.getHeaders(true),
      body: JSON.stringify({ content }),
    });

    return this.handleResponse<Comment>(response);
  }
}

export const commentService = new CommentService();
