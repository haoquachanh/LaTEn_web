/**
 * User Service Types
 *
 * TypeScript interfaces and types for the user service
 * that match the backend entity structure.
 */

/**
 * User roles in the system
 */
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  USER = 'user',
}

/**
 * User entity interface
 */
export interface User {
  id: number;
  email: string;
  role: UserRole;
  phone?: string;
  fullname?: string;
  birth?: string;
  created: string;
  updated: string;
}

/**
 * User profile update input
 */
export interface UserProfileUpdate {
  fullname?: string;
  phone?: string;
  birth?: string;
  email?: string;
}

/**
 * Password change input
 */
export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
}

/**
 * User query parameters
 */
export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  searchTerm?: string;
  sortBy?: 'id' | 'email' | 'created';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * User list response
 */
export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}
