import { getSession } from '@/services/session';

import axios from 'axios';
import { API_BASE_URL } from '@/config/apiRoutes';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface Author {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Answer {
  id: number;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export interface Question {
  id: number;
  title: string;
  content: string;
  category: string;
  isAnswered: boolean;
  acceptedAnswerId?: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
  answerCount: number;
  topAnswer?: Answer | null;
}

export interface QuestionDetail extends Question {
  answers: Answer[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  category?: string;
  tagId?: number;
  search?: string;
  status?: 'answered' | 'unanswered' | 'all';
}

export interface CreateQuestionDto {
  title: string;
  content: string;
  category?: string;
  tagIds?: number[];
}

export interface UpdateQuestionDto {
  title?: string;
  content?: string;
  category?: string;
  tagIds?: number[];
}

export interface CreateAnswerDto {
  content: string;
}

export interface UpdateAnswerDto {
  content?: string;
}

class QandAService {
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

  // Question methods

  async getQuestions(params: GetQuestionsParams = {}): Promise<PaginatedResponse<Question>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.tagId) queryParams.append('tagId', params.tagId.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const url = `${API_BASE_URL}/qanda/questions?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getHeaders(true),
    });

    return this.handleResponse<PaginatedResponse<Question>>(response);
  }

  async getQuestionById(id: number | string): Promise<QuestionDetail> {
    const url = `${API_BASE_URL}/qanda/questions/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: await this.getHeaders(true),
    });

    return this.handleResponse<QuestionDetail>(response);
  }

  async createQuestion(data: CreateQuestionDto): Promise<Question> {
    const url = `${API_BASE_URL}/qanda/questions`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Question>(response);
  }

  async updateQuestion(id: number | string, data: UpdateQuestionDto): Promise<Question> {
    const url = `${API_BASE_URL}/qanda/questions/${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: await this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Question>(response);
  }

  async deleteQuestion(id: number | string): Promise<void> {
    const url = `${API_BASE_URL}/qanda/questions/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: await this.getHeaders(true),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
    }
  }

  // Answer methods

  async addAnswer(questionId: number | string, data: CreateAnswerDto): Promise<Answer> {
    const url = `${API_BASE_URL}/qanda/questions/${questionId}/answers`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Answer>(response);
  }

  async updateAnswer(answerId: number | string, data: UpdateAnswerDto): Promise<Answer> {
    const url = `${API_BASE_URL}/qanda/answers/${answerId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: await this.getHeaders(true),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Answer>(response);
  }

  async deleteAnswer(answerId: number | string): Promise<void> {
    const url = `${API_BASE_URL}/qanda/answers/${answerId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: await this.getHeaders(true),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
    }
  }

  async acceptAnswer(questionId: number | string, answerId: number | string): Promise<Answer> {
    const url = `${API_BASE_URL}/qanda/questions/${questionId}/answers/${answerId}/accept`;
    const response = await fetch(url, {
      method: 'POST',
      headers: await this.getHeaders(true),
    });

    return this.handleResponse<Answer>(response);
  }
}

export const qandaService = new QandAService();
