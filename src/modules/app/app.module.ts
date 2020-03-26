import { Module, Logger } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'common/config';
import databaseConfig from 'common/config/database';
import { EventsModule } from 'common/events/events.module';
import { AuthModule } from 'modules/auth/auth.module';
import { AppController } from './app.controller';

const typeOrmConfig = {
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: configService.get('database.type'),
      database: configService.get('database.database'),
      entities: configService.get('database.entities'),
      migrations: configService.get('database.migrations'),
      migrationsTableName: configService.get('database.migrationsTableName'),
      logging: configService.get('database.logging'),
      synchronize: configService.get('database.synchronize'),
      keepConnectionAlive: configService.get('database.keepConnectionAlive'),
    };
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
      provide: 'logger',
      useFactory: () => new Logger(),
    },
    {
      provide: 'configService',
      useFactory: () => new ConfigService(),
    },
  ],
})
export class AppModule {}
