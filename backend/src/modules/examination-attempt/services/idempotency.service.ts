import { Injectable } from '@nestjs/common';

interface IdempotencyRecord {
  key: string;
  userId: number;
  examinationId: number;
  questionId: number;
  response: any;
  createdAt: Date;
}

@Injectable()
export class IdempotencyService {
  // In-memory cache for idempotency keys
  // In production, use Redis or a database table
  private cache: Map<string, IdempotencyRecord> = new Map();

  // Cache TTL in milliseconds (5 minutes)
  private readonly TTL = 5 * 60 * 1000;

  /**
   * Check if a request with the given idempotency key has already been processed
   * @param key Idempotency key
   * @param userId User ID
   * @param examinationId Examination ID
   * @param questionId Question ID
   * @returns The cached response if found, null otherwise
   */
  async getOrCreate(
    key: string,
    userId: number,
    examinationId: number,
    questionId: number,
    createFn: () => Promise<any>,
  ): Promise<any> {
    const cacheKey = this.buildCacheKey(key, userId, examinationId, questionId);

    // Check if we have a cached response
    const cached = this.cache.get(cacheKey);
    if (cached) {
      // Check if cache entry is still valid
      const now = new Date().getTime();
      const cacheAge = now - cached.createdAt.getTime();

      if (cacheAge < this.TTL) {
        // Return cached response
        return cached.response;
      } else {
        // Remove expired entry
        this.cache.delete(cacheKey);
      }
    }

    // Execute the function and cache the result
    const response = await createFn();

    this.cache.set(cacheKey, {
      key,
      userId,
      examinationId,
      questionId,
      response,
      createdAt: new Date(),
    });

    // Schedule cleanup
    this.scheduleCleanup();

    return response;
  }

  /**
   * Build a composite cache key
   */
  private buildCacheKey(key: string, userId: number, examinationId: number, questionId: number): string {
    return `${userId}:${examinationId}:${questionId}:${key}`;
  }

  /**
   * Clean up expired cache entries
   */
  private scheduleCleanup(): void {
    const now = new Date().getTime();

    for (const [key, record] of this.cache.entries()) {
      const age = now - record.createdAt.getTime();
      if (age >= this.TTL) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries (useful for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache size (useful for monitoring)
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}
