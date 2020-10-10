import { NodeGeocoderOptions } from './node-geocoder-options.interface';

export interface NodeGeocoderOptionsFactory {
  createNodeGeocoderOptions():
    | Promise<NodeGeocoderOptions>
    | NodeGeocoderOptions;
}
