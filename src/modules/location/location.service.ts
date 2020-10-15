import { Inject, Injectable, Logger } from '@nestjs/common';
import convert from 'cyrillic-to-latin';
import { PINNED_LOCATION } from 'modules/location/location.constants';
import { Location } from 'modules/location/location.dto';
import { LocationRepository } from 'modules/location/location.repository';
import { NODE_GEOCODER_OPTIONS_FACTORY } from 'modules/external/node-geocoder';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @Inject(NODE_GEOCODER_OPTIONS_FACTORY)
    private readonly geocoderService,
    private readonly locationRepository: LocationRepository,
  ) {}

  async findOrCreate(locationDto: Location): Promise<Location> {
    const location = await this.locationRepository.findLocation(
      locationDto.latitude,
      locationDto.longitude,
    );
    if (location) return location;

    if (locationDto.title === PINNED_LOCATION) {
      const title = await this.getLocationTitle(locationDto);
      if (title) {
        const convertedTitle = convert(title);
        return this.locationRepository.createLocation({
          ...locationDto,
          title: convertedTitle,
        });
      }
    }

    return this.locationRepository.createLocation(locationDto);
  }

  getLocationTitle = async (locationDto: Location): Promise<string> => {
    try {
      const [location] = await this.geocoderService.reverse({
        lat: locationDto.latitude,
        lon: locationDto.longitude,
      });
      if (!location.streetName || !location.streetNumber) return location.city;

      return `${location.streetName} ${location.streetNumber}, ${location.city}`;
    } catch (err) {
      this.logger.error(err);
      return;
    }
  };
}
