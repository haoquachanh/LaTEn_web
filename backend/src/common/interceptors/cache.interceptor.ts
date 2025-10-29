import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';
import { CACHE_KEY_METADATA } from '../decorators/cache-key.decorator';
import { CACHE_TTL_METADATA } from '../decorators/cache-ttl.decorator';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!cacheKey) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const key = this.generateCacheKey(cacheKey, request);

    const cachedResponse = await this.cacheManager.get(key);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    const ttl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );

    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.set(key, response, { ttl: ttl || 3600 });
      }),
    );
  }

  private generateCacheKey(baseKey: string, request: any): string {
    const query = JSON.stringify(request.query);
    const params = JSON.stringify(request.params);
    const userId = request.user?.id || 'anonymous';
    return `${baseKey}:${userId}:${params}:${query}`;
  }
}
