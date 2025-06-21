import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from '../custom-logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: MyLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;

    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const message = `${method} ${originalUrl} ${statusCode} ${duration}ms - User-Agent: ${userAgent} IP: ${ip}`;

      this.logger.log(`Request: ${message}`, LoggingMiddleware.name);
      this.logger.debug(
        `Query: ${JSON.stringify(query)}`,
        LoggingMiddleware.name,
      );
      this.logger.debug(
        `Body: ${JSON.stringify(body)}`,
        LoggingMiddleware.name,
      );
    });

    next();
  }
}
