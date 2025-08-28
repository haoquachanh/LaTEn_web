import { Global, Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';

/**
 * Global Logger Module
 * Makes AppLoggerService available across the entire application
 * without needing explicit imports in other modules
 */
@Global()
@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
