import { Injectable } from '@nestjs/common';
import { Location } from './location.dto';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  findOrCreate = async (location: Location): Promise<Location> =>
    this.locationRepository.findOrCreate(location);
}
