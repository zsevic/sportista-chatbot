import path from 'path';
import {
  Injectable,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationShutdown,
  RequestMethod,
} from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import rateLimit from 'express-rate-limit';
import { Subject } from 'rxjs';
import { Connection } from 'typeorm';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import config from 'common/config';
import { I18N_FALLBACKS, NODEGEOCODER_PROVIDER } from 'common/config/constants';
import databaseConfig from 'common/config/database';
import { RATE_LIMIT_REQUESTS, RATE_LIMIT_TIME } from 'common/config/rate-limit';
import { BotsModule } from 'modules/bots/bots.module';
import { ExtensionsModule } from 'modules/extensions/extensions.module';
import { BootbotModule, BootbotOptions } from 'modules/external/bootbot';
import { I18nModule } from 'modules/external/i18n';
import { NodeGeocoderModule } from 'modules/external/node-geocoder';
import { WebhookModule } from 'modules/webhook/webhook.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        initializeTransactionalContext();
        patchTypeORMRepositoryWithBaseRepository();
        return configService.get('database');
      },
    }),
    BootbotModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): BootbotOptions => ({
        accessToken: configService.get('FB_PAGE_ACCESS_TOKEN'),
        appSecret: configService.get('FB_APP_SECRET'),
        graphApiVersion: configService.get('GRAPH_API_VERSION'),
        verifyToken: configService.get('WEBHOOK_VERIFY_TOKEN'),
      }),
    }),
    I18nModule.registerAsync({
      useFactory: () => ({
        directory: path.join(__dirname, '../../../locales'),
        fallbacks: I18N_FALLBACKS,
        objectNotation: true,
      }),
    }),
    NodeGeocoderModule.registerAsync({
      useFactory: () => ({
        provider: NODEGEOCODER_PROVIDER,
      }),
    }),
    ExtensionsModule,
    WebhookModule,
    BotsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'configService',
      useFactory: () => new ConfigService(),
    },
  ],
})
@Injectable()
export class AppModule implements NestModule, OnApplicationShutdown {
  private readonly logger = new Logger(AppModule.name);
  private readonly shutdownListener$: Subject<void> = new Subject();

  constructor(private readonly connection: Connection) {}

  closeDatabaseConnection = async (): Promise<void> => {
    try {
      await this.connection.close();
      this.logger.log('Database connection is closed');
    } catch (error) {
      this.logger.error(error.message);
    }
  };

  configure = (consumer: MiddlewareConsumer): void => {
    const rateLimitMiddleware = rateLimit({
      windowMs: RATE_LIMIT_TIME,
      max: RATE_LIMIT_REQUESTS,
    });
    const routes: RouteInfo[] = [
      {
        path: '/',
        method: RequestMethod.GET,
      },
      {
        path: '/webhook',
        method: RequestMethod.GET,
      },
    ];
    consumer.apply(rateLimitMiddleware).forRoutes(...routes);
  };

  onApplicationShutdown = async (signal: string): Promise<void> => {
    if (!signal) return;
    this.logger.log(`Detected signal: ${signal}`);

    this.shutdownListener$.next();
    return this.closeDatabaseConnection();
  };

  subscribeToShutdown = (shutdownFn: () => void): void => {
    this.shutdownListener$.subscribe(() => {
      this.logger.log('App is closed');
      shutdownFn();
    });
  };
}
