import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { NodeGeocoderService } from './node-geocoder.service';
import { NODE_GEOCODER_OPTIONS } from './constants';
import {
  NodeGeocoderOptions,
  NodeGeocoderAsyncOptions,
  NodeGeocoderOptionsFactory,
} from './interfaces';
import {
  createNodeGeocoderProviders,
  nodeGeocoderFactory,
} from './node-geocoder.providers';

@Global()
@Module({
  providers: [NodeGeocoderService, nodeGeocoderFactory],
  exports: [NodeGeocoderService, nodeGeocoderFactory],
})
export class NodeGeocoderModule {
  /**
   * Registers a configured NodeGeocoder Module for import into the current module
   */
  public static register(options: NodeGeocoderOptions): DynamicModule {
    return {
      module: NodeGeocoderModule,
      providers: createNodeGeocoderProviders(options),
    };
  }

  /**
   * Registers a configured NodeGeocoder Module for import into the current module
   * using dynamic options (factory, etc)
   */
  public static registerAsync(
    options: NodeGeocoderAsyncOptions,
  ): DynamicModule {
    return {
      module: NodeGeocoderModule,
      providers: [...this.createProviders(options)],
    };
  }

  private static createProviders(
    options: NodeGeocoderAsyncOptions,
  ): Provider[] {
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

  private static createOptionsProvider(
    options: NodeGeocoderAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NODE_GEOCODER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // For useExisting...
    return {
      provide: NODE_GEOCODER_OPTIONS,
      useFactory: async (optionsFactory: NodeGeocoderOptionsFactory) =>
        await optionsFactory.createNodeGeocoderOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
