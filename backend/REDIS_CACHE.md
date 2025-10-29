# Redis Cache Integration

## Overview
Redis cache đã được tích hợp vào backend NestJS để tối ưu hiệu suất cho các API thường xuyên truy vấn.

## Infrastructure

### Docker Configuration
- **Image**: redis:7-alpine
- **Port**: 6379
- **Memory Limit**: 256MB
- **Eviction Policy**: allkeys-lru (Least Recently Used)
- **Password**: ${REDIS_PASSWORD} (từ .env)

### Environment Variables
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=578722
REDIS_TTL=3600
```

## Implementation

### 1. Global Cache Module
Cache module được đăng ký global trong [app.module.ts](src/app.module.ts):
```typescript
CacheModule.registerAsync({
  isGlobal: true,
  imports: [ConfigModule],
  useClass: CacheConfig,
  inject: [ConfigService],
})
```

### 2. Cache Configuration
File [cache.config.ts](src/config/cache.config.ts) quản lý cấu hình Redis với:
- Redis Store (cache-manager-redis-store v2.0.0)
- Host/Port/Password từ environment
- TTL mặc định 3600s
- Max 100 keys

### 3. Cache Decorators

#### @CacheKey(key: string)
Định nghĩa base key cho cache:
```typescript
@CacheKey('exam:presets')
```

#### @CacheTTL(ttl: number)
Thiết lập Time-To-Live (seconds):
```typescript
@CacheTTL(1800) // 30 minutes
```

### 4. Cache Interceptor
[HttpCacheInterceptor](src/common/interceptors/cache.interceptor.ts) tự động:
- Generate cache key từ baseKey + userId + params + query
- Check cache trước khi call handler
- Store response vào Redis với TTL được chỉ định

### 5. Cache Service
[CacheService](src/common/services/cache.service.ts) cung cấp:
- `get<T>(key)`: Lấy giá trị từ cache
- `set(key, value, ttl?)`: Lưu vào cache
- `delete(key)`: Xóa một key
- `deleteByPattern(pattern)`: Xóa nhiều keys theo pattern
- `reset()`: Xóa toàn bộ cache

## Cached Endpoints

### Examination Module
| Endpoint | Cache Key | TTL | Description |
|----------|-----------|-----|-------------|
| GET /examinations/presets | exam:presets | 1800s | Danh sách bài thi mẫu (30 phút) |
| GET /examinations/presets/:id | exam:preset | 1800s | Chi tiết bài thi mẫu (30 phút) |
| GET /examinations/stats/:userId | exam:stats | 300s | Thống kê người dùng (5 phút) |
| GET /examinations/:id | exam:detail | 600s | Chi tiết bài thi (10 phút) |

## Cache Key Strategy

Cache key format:
```
{baseKey}:{userId}:{params}:{query}
```

Ví dụ:
```
exam:presets:anonymous:{}:{"page":"1","limit":"10"}
exam:detail:123:{"id":"45"}:{}
exam:stats:456:{"userId":"456"}:{}
```

## Invalidation Strategy

### Manual Invalidation
Sử dụng CacheService để xóa cache khi data thay đổi:

```typescript
constructor(private cacheService: CacheService) {}

async updateExamPreset(id: number, data: any) {
  const result = await this.repository.update(id, data);
  await this.cacheService.deleteByPattern('exam:preset');
  await this.cacheService.deleteByPattern('exam:presets');
  return result;
}
```

### Auto Invalidation
TTL tự động hết hạn:
- Exam presets: 30 phút
- User stats: 5 phút
- Exam details: 10 phút

## Performance Impact

### Before Cache
- Exam presets API: ~200-300ms
- User stats API: ~150-250ms

### After Cache (Expected)
- Cache hit: ~10-20ms
- Cache miss: ~200-300ms + cache storage (~5ms)

### Memory Usage
- 100 keys max
- ~256MB limit
- LRU eviction policy

## Monitoring

### Check Redis Status
```bash
docker exec laten-redis-dev redis-cli -a 578722 ping
```

### View All Keys
```bash
docker exec laten-redis-dev redis-cli -a 578722 keys '*'
```

### Get Cache Stats
```bash
docker exec laten-redis-dev redis-cli -a 578722 INFO stats
```

### Check Memory Usage
```bash
docker exec laten-redis-dev redis-cli -a 578722 INFO memory
```

## Best Practices

1. **Cache Read-Heavy Endpoints**: Chỉ cache các endpoint GET với data ít thay đổi
2. **Appropriate TTL**: Điều chỉnh TTL theo tần suất thay đổi data
3. **Cache Invalidation**: Xóa cache khi data được update/delete
4. **Key Naming**: Sử dụng prefix rõ ràng (exam:, user:, post:)
5. **Monitor Memory**: Giới hạn max keys và memory để tránh OOM

## Future Improvements

1. Implement cache warming cho static data
2. Add cache metrics (hit rate, miss rate)
3. Distributed caching cho multi-instance deployment
4. Cache compression cho large responses
5. Add cache middleware cho specific routes
