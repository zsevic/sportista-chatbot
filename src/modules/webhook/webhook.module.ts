import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rateLimit from 'express-rate-limit';
import config from 'common/config';
import { RATE_LIMIT_REQUESTS, RATE_LIMIT_TIME } from 'common/config/rate-limit';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [WebhookController],
})
export class WebhookModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    const rateLimitMiddleware = rateLimit({
      windowMs: RATE_LIMIT_TIME,
      max: RATE_LIMIT_REQUESTS,
    });
    consumer.apply(rateLimitMiddleware).forRoutes({
      path: '/webhook',
      method: RequestMethod.GET,
    });
  }
}
