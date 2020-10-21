import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { I18N_OPTIONS } from './constants';
import { createI18nProviders, i18nFactory } from './i18n.providers';
import { I18nService } from './i18n.service';
import {
  I18nOptions,
  I18nAsyncOptions,
  I18nOptionsFactory,
} from './interfaces';

@Global()
@Module({
  providers: [I18nService, i18nFactory],
  exports: [I18nService, i18nFactory],
})
export class I18nModule {
  /**
   * Registers a configured I18n Module for import into the current module
   */
  public static register(options: I18nOptions): DynamicModule {
    return {
      module: I18nModule,
      providers: createI18nProviders(options),
    };
  }

  /**
   * Registers a configured I18n Module for import into the current module
   * using dynamic options (factory, etc)
   */
  public static registerAsync(options: I18nAsyncOptions): DynamicModule {
    return {
      module: I18nModule,
      providers: [...this.createProviders(options)],
    };
  }

  private static createProviders(options: I18nAsyncOptions): Provider[] {
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

  private static createOptionsProvider(options: I18nAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: I18N_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // For useExisting...
    return {
      provide: I18N_OPTIONS,
      useFactory: async (optionsFactory: I18nOptionsFactory) =>
        await optionsFactory.createI18nOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
