import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class SessionAuthMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction) {
    if (req.query.socketId) {
      req.session.socketId = req.query.socketId;
    }

    next();
  }
}
