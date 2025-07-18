import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { AppConfigService } from '../../config/app-config.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn().mockResolvedValue({
              status: 'ok',
              info: {},
              error: {},
              details: {},
            }),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn().mockResolvedValue({ memory_heap: { status: 'up' } }),
            checkRSS: jest.fn().mockResolvedValue({ memory_rss: { status: 'up' } }),
          },
        },
        {
          provide: AppConfigService,
          useValue: {
            nodeEnv: 'test',
            getConfigSummary: jest.fn().mockReturnValue({
              environment: 'test',
              port: '3001',
              database: { host: 'localhost', port: '5432' },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health check result', async () => {
    const result = await controller.check();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('info');
  });

  it('should return service info', () => {
    const result = controller.getInfo();
    expect(result).toHaveProperty('service', 'LaTEn Backend API');
    expect(result).toHaveProperty('environment');
    expect(result).toHaveProperty('uptime');
    expect(typeof result.uptime).toBe('number');
  });
});
