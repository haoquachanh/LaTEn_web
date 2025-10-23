import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Performance monitoring interceptor
 * Logs execution time and important metrics for each request
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);

  // Thresholds for performance warnings
  private readonly SLOW_REQUEST_THRESHOLD = 1000; // 1 second
  private readonly VERY_SLOW_REQUEST_THRESHOLD = 3000; // 3 seconds

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = request.user?.id || 'anonymous';

    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Log incoming request
    this.logger.log({
      message: 'Incoming request',
      requestId,
      method,
      url,
      userId,
      ip,
      userAgent,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const executionTime = endTime - startTime;
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;

          // Determine log level based on execution time
          const logLevel = this.getLogLevel(executionTime);

          const logData = {
            message: 'Request completed',
            requestId,
            method,
            url,
            userId,
            statusCode,
            executionTime: `${executionTime}ms`,
            dataSize: this.getDataSize(data),
          };

          // Log based on performance
          if (logLevel === 'warn') {
            this.logger.warn({
              ...logData,
              message: '⚠️ Slow request detected',
            });
          } else if (logLevel === 'error') {
            this.logger.error({
              ...logData,
              message: '❌ Very slow request detected',
            });
          } else {
            this.logger.log(logData);
          }

          // Log performance metrics for specific routes
          if (this.shouldLogPerformanceMetrics(url)) {
            this.logPerformanceMetrics(method, url, executionTime, statusCode);
          }
        },
        error: (error) => {
          const endTime = Date.now();
          const executionTime = endTime - startTime;

          this.logger.error({
            message: '❌ Request failed',
            requestId,
            method,
            url,
            userId,
            executionTime: `${executionTime}ms`,
            error: error.message,
            stack: error.stack,
          });
        },
      }),
    );
  }

  /**
   * Determine log level based on execution time
   */
  private getLogLevel(executionTime: number): 'log' | 'warn' | 'error' {
    if (executionTime >= this.VERY_SLOW_REQUEST_THRESHOLD) {
      return 'error';
    } else if (executionTime >= this.SLOW_REQUEST_THRESHOLD) {
      return 'warn';
    }
    return 'log';
  }

  /**
   * Get approximate data size
   */
  private getDataSize(data: any): string {
    if (!data) return '0 B';

    try {
      const jsonString = JSON.stringify(data);
      const bytes = new Blob([jsonString]).size;

      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Check if we should log detailed performance metrics for this URL
   */
  private shouldLogPerformanceMetrics(url: string): boolean {
    const performanceRoutes = [
      '/api/examination',
      '/api/examination-attempt/start',
      '/api/examination-attempt/submit',
      '/api/examination-attempt/complete',
    ];

    return performanceRoutes.some((route) => url.includes(route));
  }

  /**
   * Log detailed performance metrics
   */
  private logPerformanceMetrics(method: string, url: string, executionTime: number, statusCode: number): void {
    const metrics = {
      route: `${method} ${url}`,
      executionTime,
      statusCode,
      timestamp: new Date().toISOString(),
      performance: this.categorizePerformance(executionTime),
    };

    if (executionTime > this.SLOW_REQUEST_THRESHOLD) {
      this.logger.warn({
        message: '📊 Performance metrics',
        ...metrics,
      });
    } else {
      this.logger.debug({
        message: '📊 Performance metrics',
        ...metrics,
      });
    }
  }

  /**
   * Categorize performance
   */
  private categorizePerformance(executionTime: number): string {
    if (executionTime < 100) return 'excellent';
    if (executionTime < 500) return 'good';
    if (executionTime < 1000) return 'acceptable';
    if (executionTime < 3000) return 'slow';
    return 'very slow';
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
