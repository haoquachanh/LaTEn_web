import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {
    this.validateConfig();
  }

  /**
   * Validate all required configuration on startup
   * This prevents runtime errors due to missing config
   */
  private validateConfig(): void {
    const requiredConfigs = [
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
      'JWT_SECRET',
      'FRONTEND_URL',
    ];

    const missing = requiredConfigs.filter((key) => !this.configService.get(key));

    if (missing.length > 0) {
      throw new Error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    }

    const jwtSecret = this.configService.get('JWT_SECRET');
    if (jwtSecret && jwtSecret.length < 32) {
      throw new Error('❌ JWT_SECRET must be at least 32 characters long for security');
    }
  }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV', 'development');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get port(): number {
    return this.configService.get('PORT', 3001);
  }

  get database() {
    return {
      type: 'postgres' as const,
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      synchronize: this.isDevelopment,
      logging: this.isDevelopment ? 'all' : ['error'],
      ssl: this.isProduction ? { rejectUnauthorized: false } : false,
      retryAttempts: this.isProduction ? 10 : 1,
      retryDelay: 3000,
    };
  }

  get jwt() {
    return {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '24h'),
    };
  }

  get cors() {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    return {
      origin: this.isDevelopment ? [frontendUrl, 'http://localhost:3000'] : frontendUrl,
      credentials: true,
    };
  }

  get admin() {
    return {
      email: this.configService.get('ADMIN_EMAIL', 'admin@laten.com'),
      password: this.configService.get('ADMIN_PASSWORD', 'Laten@dmin00'),
    };
  }

  get api() {
    return {
      prefix: this.configService.get('API_PREFIX', 'api'),
      version: this.configService.get('API_VERSION', 'v1'),
    };
  }

  // Logging configuration
  get logging() {
    return {
      level: this.isProduction ? 'error' : 'debug',
      format: this.isProduction ? 'json' : 'simple',
    };
  }

  get upload() {
    return {
      dest: this.configService.get('UPLOAD_DEST', './uploads'),
      maxSize: this.configService.get('MAX_FILE_SIZE', 10 * 1024 * 1024),
    };
  }

  get rateLimit() {
    return {
      ttl: this.configService.get('RATE_LIMIT_TTL', 60),
      limit: this.configService.get('RATE_LIMIT_LIMIT', this.isProduction ? 60 : 1000),
    };
  }

  get health() {
    return {
      timeout: this.configService.get('HEALTH_CHECK_TIMEOUT', 10000),
      database: true,
      memory: true,
      disk: false,
    };
  }

  getConfigSummary() {
    return {
      environment: this.nodeEnv,
      port: this.port,
      database: {
        host: this.database.host,
        port: this.database.port,
        database: this.database.database,
        ssl: !!this.database.ssl,
      },
      frontend: this.configService.get('FRONTEND_URL'),
      apiPrefix: this.api.prefix,
      isDevelopment: this.isDevelopment,
      isProduction: this.isProduction,
    };
  }
}
