import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { AppConfigService } from '../../config/app-config.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private configService: AppConfigService,
  ) {}

  @ApiOperation({ summary: 'Comprehensive health check' })
  @ApiResponse({ status: 200, description: 'Health check results' })
  @Get()
  @HealthCheck()
  async check() {
    const healthConfig = this.configService.health;
    const memoryLimit = this.configService.isTest ? 1024 * 1024 * 1024 : 150 * 1024 * 1024;

    const checks = [
      () => this.db.pingCheck('database', { timeout: healthConfig.timeout }),
      () => this.memory.checkHeap('memory_heap', memoryLimit),
    ];

    // Skip memory_rss check in test environment as it might be too restrictive
    if (!this.configService.isTest) {
      checks.push(() => this.memory.checkRSS('memory_rss', memoryLimit));
    }

    // Get the health check result
    const result = await this.health.check(checks);

    // Add timestamp and uptime for e2e tests
    return {
      ...result,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @ApiOperation({ summary: 'Service information' })
  @ApiResponse({ status: 200, description: 'Service info and configuration' })
  @Get('info')
  getInfo() {
    return {
      service: 'LaTEn Backend API',
      version: process.env.npm_package_version || '1.0.0',
      environment: this.configService.nodeEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      config: this.configService.getConfigSummary(),
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
    };
  }

  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is ready to accept traffic' })
  @Get('ready')
  getReadiness() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  @Get('live')
  getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
