import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = new Logger(loggerMiddleware.name);
  morgan.token('url', (request) => request._parsedUrl.pathname);
  morgan(
    ':method :url :status (:res[content-length] length) (:response-time ms)',
    {
      stream: {
        write: (text: string) => logger.log(text),
      },
    },
  )(req, res, next);
}
