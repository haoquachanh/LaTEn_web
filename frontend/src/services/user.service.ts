/**
 * User Service
 *
 * Enterprise-grade service for user profile management
 * and user administration.
 */
import api from './api';
import {
  PasswordChangeInput,
  User,
  UserListResponse,
  UserProfileUpdate,
  UserQueryParams,
  UserRole,
} from './types/user.types';

/**
 * UserService provides methods to interact with user endpoints
 */
class UserService {
  private basePath = '/users';

  /**
   * Get list of users with pagination and filtering
   *
   * @param params Query parameters
   * @returns Promise with paginated user list
   */
  async getUsers(params?: UserQueryParams): Promise<UserListResponse> {
    try {
      const response = await api.get(this.basePath, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   *
   * @param id User ID
   * @returns Promise with user details
   */
  async getUserById(id: number | string): Promise<User> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get current user profile
   *
   * @returns Promise with current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get(`${this.basePath}/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   *
   * @param userData Profile data to update
   * @returns Promise with updated user profile
   */
  async updateProfile(userData: UserProfileUpdate): Promise<User> {
    try {
      const response = await api.put(`${this.basePath}/profile`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Update user password
   *
   * @param passwordData Current and new passwords
   * @returns Promise with success message
   */
  async updatePassword(passwordData: PasswordChangeInput): Promise<{ message: string; success: boolean }> {
    try {
      const response = await api.put(`${this.basePath}/password`, passwordData);
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Update user role (admin only)
   *
   * @param id User ID
   * @param role New role
   * @returns Promise with updated user
   */
  async updateUserRole(id: number | string, role: UserRole): Promise<User> {
    try {
      const response = await api.put(`${this.basePath}/${id}/role`, { role });
      return response.data;
    } catch (error) {
      console.error(`Error updating role for user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user (admin only)
   *
   * @param userData User data
   * @returns Promise with created user
   */
  async createUser(userData: {
    email: string;
    password: string;
    role?: UserRole;
    fullname?: string;
    phone?: string;
    birth?: string;
  }): Promise<User> {
    try {
      const response = await api.post(this.basePath, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Delete a user (admin only)
   *
   * @param id User ID
   * @returns Promise with success message
   */
  async deleteUser(id: number | string): Promise<{ message: string; success: boolean }> {
    try {
      const response = await api.delete(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get user statistics (admin/teacher only)
   *
   * @returns Promise with user stats
   */
  async getUserStats(): Promise<{
    total: number;
    active: number;
    teachers: number;
    admins: number;
    newThisMonth: number;
  }> {
    try {
      const response = await api.get(`${this.basePath}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;
