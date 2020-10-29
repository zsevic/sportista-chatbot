import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { isEnv } from 'common/utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception?.code === 'EBADCSRFTOKEN')
      return response.sendStatus(HttpStatus.FORBIDDEN);

    if (status >= 500) {
      this.logger.error(exception.stack);
      const isProdEnv = isEnv('production');
      if (isProdEnv) {
        Sentry.captureException(exception);
      }
    } else {
      this.logger.error(exception.message);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
