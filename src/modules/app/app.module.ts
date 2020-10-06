import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import config from 'common/config';
import { BotsModule } from 'modules/bots/bots.module';
import { ExtensionsModule } from 'modules/extensions/extensions.module';
import { WebhookModule } from 'modules/webhook/webhook.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot(),
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
export class AppModule {
  constructor() {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
  }
}
