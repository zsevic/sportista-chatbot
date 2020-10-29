import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ConfigModule } from '@nestjs/config';
import csurf from 'csurf';
import config from 'common/config';
import { ExtensionsController } from './extensions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [ExtensionsController],
})
export class ExtensionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const csrfMiddleware = csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        signed: true,
      },
    });
    const routes: RouteInfo[] = [
      {
        path: '/extensions/datetime',
        method: RequestMethod.ALL,
      },
      {
        path: '/extensions/location',
        method: RequestMethod.ALL,
      },
    ];
    consumer.apply(csrfMiddleware).forRoutes(...routes);
  }
}
