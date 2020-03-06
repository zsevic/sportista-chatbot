import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';

export const loggerMiddleware = (logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
  morgan(':method :url :status (:res[content-length] length) (:response-time ms)', {
    stream: {
      write: (text: string) => logger.log(text),
    },
  })(req, res, next);
};
