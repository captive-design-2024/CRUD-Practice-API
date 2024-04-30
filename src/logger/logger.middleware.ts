// Nest Packages
import { Injectable, NestMiddleware } from '@nestjs/common';

// Third-party Packages
import { Request, Response, NextFunction } from 'express';
import * as process from 'process';

// Custom Packages
import { GlobalLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: GlobalLogger) {
    this.logger.setContext('RequestProfiler');
  }

  use(req: Request, res: Response, next: NextFunction): any {
    const timeStart = process.hrtime();

    res.on('finish', () => {
      // Parse original URL and method
      const { method, originalUrl, ip } = req;
      const { statusCode } = res;
      // Returns second and nanosecond
      const performanceTime = process.hrtime(timeStart);
      // Convert nanosecond to millisecond
      const millisecond = (performanceTime[1] * 1e-6).toFixed(3);
      this.logger.log(
        `[${method}] - ${originalUrl} - ${statusCode} (IP: ${ip}, Time: ${millisecond} ms)`,
      );
    });
    next();
  }
}
