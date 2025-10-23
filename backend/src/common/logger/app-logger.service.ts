import { Injectable, Logger, LoggerService } from '@nestjs/common';

export interface LogContext {
  [key: string]: any;
}

/**
 * Application-wide logging service
 * Provides structured logging with context
 */
@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger = new Logger('Application');

  /**
   * Log an informational message
   */
  log(message: string, context?: LogContext): void {
    this.logger.log(this.formatMessage(message, context));
  }

  /**
   * Log an error message
   */
  error(message: string, trace?: string, context?: LogContext): void {
    this.logger.error(this.formatMessage(message, context), trace);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    this.logger.warn(this.formatMessage(message, context));
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: LogContext): void {
    this.logger.debug(this.formatMessage(message, context));
  }

  /**
   * Log a verbose message
   */
  verbose(message: string, context?: LogContext): void {
    this.logger.verbose(this.formatMessage(message, context));
  }

  /**
   * Log database query
   */
  logQuery(query: string, parameters?: any[], executionTime?: number): void {
    const context = {
      query,
      parameters,
      executionTime: executionTime ? `${executionTime}ms` : undefined,
    };

    if (executionTime && executionTime > 1000) {
      this.warn('Slow database query detected', context);
    } else {
      this.debug('Database query executed', context);
    }
  }

  /**
   * Log authentication event
   */
  logAuth(event: string, userId: number, context?: LogContext): void {
    this.log(`Authentication: ${event}`, {
      userId,
      ...context,
    });
  }

  /**
   * Log examination event
   */
  logExamination(event: string, examinationId: number, userId: number, context?: LogContext): void {
    this.log(`Examination: ${event}`, {
      examinationId,
      userId,
      ...context,
    });
  }

  /**
   * Log security event
   */
  logSecurity(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext): void {
    const message = `🔒 Security: ${event}`;

    switch (severity) {
      case 'critical':
      case 'high':
        this.error(message, undefined, { severity, ...context });
        break;
      case 'medium':
        this.warn(message, { severity, ...context });
        break;
      default:
        this.log(message, { severity, ...context });
    }
  }

  /**
   * Log API rate limit event
   */
  logRateLimit(userId: number, endpoint: string, context?: LogContext): void {
    this.warn('Rate limit exceeded', {
      userId,
      endpoint,
      ...context,
    });
  }

  /**
   * Log business metric
   */
  logMetric(metricName: string, value: number, unit?: string, context?: LogContext): void {
    this.log(`📊 Metric: ${metricName}`, {
      value,
      unit,
      ...context,
    });
  }

  /**
   * Log error with full context
   */
  logException(error: Error, context?: LogContext): void {
    this.error(error.message, error.stack, {
      name: error.name,
      ...context,
    });
  }

  /**
   * Format message with context
   */
  private formatMessage(message: string, context?: LogContext): string {
    if (!context || Object.keys(context).length === 0) {
      return message;
    }

    const contextStr = JSON.stringify(context, null, 2);
    return `${message}\nContext: ${contextStr}`;
  }

  /**
   * Create a child logger with a specific context
   */
  createChildLogger(context: string): Logger {
    return new Logger(context);
  }
}
