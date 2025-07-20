/**
 * Dictionary Service
 *
 * Enterprise-grade service for dictionary operations
 * including word lookup, management, and favorites.
 */
import api from './api';
import {
  DictionarySearchParams,
  DictionarySearchResponse,
  DictionaryWord,
  DictionaryWordInput,
  FavoriteWordResponse,
  WordType,
} from './types/dictionary.types';

/**
 * DictionaryService provides methods to interact with dictionary endpoints
 */
class DictionaryService {
  private basePath = '/dictionary';

  /**
   * Search dictionary for words matching query
   *
   * @param query Search term
   * @param params Additional search parameters
   * @returns Promise with search results
   */
  async search(query: string, params?: Omit<DictionarySearchParams, 'q'>): Promise<DictionarySearchResponse> {
    try {
      const response = await api.get(`${this.basePath}/search`, {
        params: {
          q: query,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching dictionary for "${query}":`, error);
      throw error;
    }
  }

  /**
   * Get word details by ID
   *
   * @param id Word ID
   * @returns Promise with word details
   */
  async getWordById(id: number | string): Promise<DictionaryWord> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dictionary word ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all words in dictionary
   *
   * @param params Pagination and filtering parameters
   * @returns Promise with dictionary words
   */
  async getAllWords(params?: Omit<DictionarySearchParams, 'q'>): Promise<DictionarySearchResponse> {
    try {
      const response = await api.get(this.basePath, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all dictionary words:', error);
      throw error;
    }
  }

  /**
   * Get words by type
   *
   * @param type Word type
   * @param params Additional parameters
   * @returns Promise with filtered words
   */
  async getWordsByType(
    type: WordType,
    params?: Omit<DictionarySearchParams, 'type'>,
  ): Promise<DictionarySearchResponse> {
    try {
      const response = await api.get(`${this.basePath}/type/${type}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching dictionary words by type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Create a new dictionary word (admin/teacher only)
   *
   * @param wordData Word data
   * @returns Promise with created word
   */
  async createWord(wordData: DictionaryWordInput): Promise<DictionaryWord> {
    try {
      const response = await api.post(this.basePath, wordData);
      return response.data;
    } catch (error) {
      console.error(`Error creating dictionary word "${wordData.word}":`, error);
      throw error;
    }
  }

  /**
   * Update an existing word (admin/teacher only)
   *
   * @param id Word ID
   * @param wordData Updated word data
   * @returns Promise with update result
   */
  async updateWord(id: number | string, wordData: Partial<DictionaryWordInput>): Promise<DictionaryWord> {
    try {
      const response = await api.put(`${this.basePath}/${id}`, wordData);
      return response.data;
    } catch (error) {
      console.error(`Error updating dictionary word ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a dictionary word (admin only)
   *
   * @param id Word ID
   * @returns Promise with delete result
   */
  async deleteWord(id: number | string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting dictionary word ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add a word to user's favorites
   *
   * @param id Word ID
   * @returns Promise with favorite result
   */
  async addToFavorites(id: number | string): Promise<FavoriteWordResponse> {
    try {
      const response = await api.post(`${this.basePath}/${id}/favorite`);
      return response.data;
    } catch (error) {
      console.error(`Error adding word ${id} to favorites:`, error);
      throw error;
    }
  }

  /**
   * Remove a word from user's favorites
   *
   * @param id Word ID
   * @returns Promise with unfavorite result
   */
  async removeFromFavorites(id: number | string): Promise<FavoriteWordResponse> {
    try {
      const response = await api.delete(`${this.basePath}/${id}/favorite`);
      return response.data;
    } catch (error) {
      console.error(`Error removing word ${id} from favorites:`, error);
      throw error;
    }
  }

  /**
   * Get user's favorite words
   *
   * @param params Pagination parameters
   * @returns Promise with favorite words
   */
  async getFavoriteWords(params?: Omit<DictionarySearchParams, 'q'>): Promise<DictionarySearchResponse> {
    try {
      const response = await api.get(`${this.basePath}/favorites`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite words:', error);
      throw error;
    }
  }
}

const dictionaryService = new DictionaryService();
export default dictionaryService;
