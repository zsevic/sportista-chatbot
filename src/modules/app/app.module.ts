import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import config from 'common/config';
import databaseConfig from 'common/config/database';
import { EventsModule } from 'common/events/events.module';
import { AuthModule } from 'modules/auth/auth.module';
import { AppController } from './app.controller';

const typeOrmConfig = {
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      expandVariables: true,
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
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'configService',
      useFactory: () => new ConfigService(),
    },
  ],
})
export class AppModule {}
