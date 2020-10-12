import path from 'path';
import {
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { Subject } from 'rxjs';
import { Connection } from 'typeorm';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import config from 'common/config';
import { NODEGEOCODER_PROVIDER } from 'common/config/constants';
import databaseConfig from 'common/config/database';
import { BotsModule } from 'modules/bots/bots.module';
import { ExtensionsModule } from 'modules/extensions/extensions.module';
import { BootbotModule, BootbotOptions } from 'modules/external/bootbot';
import { NodeGeocoderModule } from 'modules/external/node-geocoder';
import { WebhookModule } from 'modules/webhook/webhook.module';
import { AppController } from './app.controller';

const typeOrmConfig = {
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
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    BootbotModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): BootbotOptions => ({
        accessToken: configService.get('FB_PAGE_ACCESS_TOKEN'),
        appSecret: configService.get('FB_APP_SECRET'),
        graphApiVersion: configService.get('GRAPH_API_VERSION'),
        verifyToken: configService.get('WEBHOOK_VERIFY_TOKEN'),
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'sr',
      fallbacks: {
        en_GB: 'en',
        sr_RS: 'sr',
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '../../../i18n/'),
      },
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
export class AppModule implements OnApplicationShutdown {
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
