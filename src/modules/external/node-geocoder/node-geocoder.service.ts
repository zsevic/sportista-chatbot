import { Injectable, Inject } from '@nestjs/common';
import NodeGeocoder from 'node-geocoder';
import { NODE_GEOCODER_OPTIONS } from './constants';
import { NodeGeocoderOptions } from './interfaces';

interface INodeGeocoderService {
  getInstance();
}

@Injectable()
export class NodeGeocoderService implements INodeGeocoderService {
  private _instance: any;
  constructor(
    @Inject(NODE_GEOCODER_OPTIONS)
    private _NodeGeocoderOptions: NodeGeocoderOptions,
  ) {}

  getInstance() {
    if (!this._instance) {
      this._instance = NodeGeocoder(this._NodeGeocoderOptions);
    }
    return this._instance;
  }
}
