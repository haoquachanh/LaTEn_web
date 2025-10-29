import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, { ttl: ttl || 3600 });
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const keys = await this.cacheManager.store.keys();
    const matchedKeys = keys.filter((key: string) => key.includes(pattern));
    await Promise.all(matchedKeys.map((key: string) => this.cacheManager.del(key)));
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }
}
