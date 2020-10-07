import { Injectable, Logger } from '@nestjs/common';
import convert from 'cyrillic-to-latin';
import { PINNED_LOCATION } from 'modules/activity/location/location.constants';
import { Location } from 'modules/activity/location/location.dto';
import { LocationRepository } from 'modules/activity/location/location.repository';
import { GeocoderService } from './geocoder.service';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    private readonly geocoderService: GeocoderService,
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
      const locationData = await this.geocoderService.instance.reverse({
        lat: locationDto.latitude,
        lon: locationDto.longitude,
      });
      return `${locationData[0].streetName} ${locationData[0].streetNumber}, ${locationData[0].city}`;
    } catch (err) {
      this.logger.error(err);
      return;
    }
  };
}
