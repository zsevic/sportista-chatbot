/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
import { NodeGeocoderOptions } from './node-geocoder-options.interface';
import { NodeGeocoderOptionsFactory } from './node-geocoder-options-factory.interface';

export interface NodeGeocoderAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<NodeGeocoderOptionsFactory>;
  useClass?: Type<NodeGeocoderOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<NodeGeocoderOptions> | NodeGeocoderOptions;
}
