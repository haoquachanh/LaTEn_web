export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullname: string;
    role?: string;
  };
}

export interface UserProfile {
  id: string;
  fullname: string;
  email: string;
  avatar?: string;
  role?: string;
  created: string;
  updated: string;
  birth?: string;
  phone?: string;
  status?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  instructor: string;
  thumbnail?: string;
}

export interface Question {
  id: string;
  question: string;
  answers?: string[];
  correctAnswer: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'long-answer';
}

export interface Examination {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // in minutes
  type: string;
  content: string;
}
