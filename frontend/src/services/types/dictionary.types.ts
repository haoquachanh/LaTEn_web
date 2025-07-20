/**
 * Dictionary Service Types
 *
 * TypeScript interfaces and types for the dictionary service
 * that match the backend entity structure.
 */

/**
 * Word types
 */
export enum WordType {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  ADVERB = 'adverb',
  PRONOUN = 'pronoun',
  PREPOSITION = 'preposition',
  CONJUNCTION = 'conjunction',
  INTERJECTION = 'interjection',
  NONE = 'none',
}

/**
 * Dictionary word interface
 */
export interface DictionaryWord {
  id: number;
  word: string;
  definition: string;
  type: WordType | string;
  example?: string;
  source?: string;
  created?: string;
  updated?: string;
  isFavorite?: boolean;
}

/**
 * Dictionary search parameters
 */
export interface DictionarySearchParams {
  q?: string;
  type?: WordType;
  page?: number;
  limit?: number;
  sortBy?: 'word' | 'created';
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Dictionary search response
 */
export interface DictionarySearchResponse {
  data: DictionaryWord[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Dictionary create/update parameters
 */
export interface DictionaryWordInput {
  word: string;
  definition: string;
  type: WordType | string;
  example?: string;
  source?: string;
}

/**
 * Favorite word response
 */
export interface FavoriteWordResponse {
  success: boolean;
  message: string;
  wordId: number;
  isFavorite: boolean;
}
