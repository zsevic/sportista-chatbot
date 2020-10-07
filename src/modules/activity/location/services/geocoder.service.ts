import { Injectable } from '@nestjs/common';
import NodeGeocoder from 'node-geocoder';

@Injectable()
export class GeocoderService {
  instance;
  constructor() {
    this.instance = NodeGeocoder({
      provider: 'openstreetmap',
    });
  }
}
