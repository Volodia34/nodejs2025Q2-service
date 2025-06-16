import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from './MyLogger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: MyLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `[Request] ${method} ${originalUrl} - Query: ${JSON.stringify(
          query,
        )} Body: ${JSON.stringify(body)} - [Response] Status: ${statusCode}`, 'HTTP');
    });

    next();
  }
}
