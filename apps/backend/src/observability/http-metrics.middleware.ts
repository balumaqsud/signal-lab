import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ObservabilityService } from './observability.service';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly observabilityService: ObservabilityService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on('finish', () => {
      this.observabilityService.observeHttpRequest({
        method: req.method,
        route: req.path,
        status: String(res.statusCode),
      });
    });
    next();
  }
}
