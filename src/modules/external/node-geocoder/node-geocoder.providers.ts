import {
  NODE_GEOCODER_OPTIONS,
  NODE_GEOCODER_OPTIONS_FACTORY,
} from './constants';
import { NodeGeocoderOptions } from './interfaces';
import { NodeGeocoderService } from './node-geocoder.service';

export function createNodeGeocoderProviders(options: NodeGeocoderOptions) {
  return [
    {
      provide: NODE_GEOCODER_OPTIONS,
      useValue: options,
    },
  ];
}

export const nodeGeocoderFactory = {
  provide: NODE_GEOCODER_OPTIONS_FACTORY,
  inject: [NodeGeocoderService],
  useFactory: async (nodeGeocoderService: NodeGeocoderService) => {
    return nodeGeocoderService.getInstance();
  },
};
