import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'common/config';
import { bootbotFactory, createBootbotProviders } from './bootbot.providers';
import { BootbotService } from './bootbot.service';
import { BOOTBOT_OPTIONS } from './constants';
import {
  BootbotOptions,
  BootbotAsyncOptions,
  BootbotOptionsFactory,
} from './interfaces';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [BootbotService, bootbotFactory],
  exports: [BootbotService, bootbotFactory],
})
export class BootbotModule {
  /**
   * Registers a configured Bootbot Module for import into the current module
   */
  public static register(options: BootbotOptions): DynamicModule {
    return {
      module: BootbotModule,
      providers: createBootbotProviders(options),
    };
  }

  /**
   * Registers a configured Bootbot Module for import into the current module
   * using dynamic options (factory, etc)
   */
  public static registerAsync(options: BootbotAsyncOptions): DynamicModule {
    return {
      module: BootbotModule,
      providers: [...this.createProviders(options)],
    };
  }

  private static createProviders(options: BootbotAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createOptionsProvider(options)];
    }

    return [
      this.createOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createOptionsProvider(options: BootbotAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: BOOTBOT_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // For useExisting...
    return {
      provide: BOOTBOT_OPTIONS,
      useFactory: async (optionsFactory: BootbotOptionsFactory) =>
        await optionsFactory.createBootbotOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
