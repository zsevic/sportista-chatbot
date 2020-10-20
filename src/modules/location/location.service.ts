import { Inject, Injectable, Logger } from '@nestjs/common';
import currency from 'country-to-currency';
import convertToLatin from 'cyrillic-to-latin';
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

    const locationData = await this.getLocationData(
      locationDto.latitude,
      locationDto.longitude,
    );
    if (!locationData) throw new Error('Location data is not valid');

    const currencyCode = currency[locationData.countryCode];
    if (locationDto.title === PINNED_LOCATION) {
      const title = this.getLocationTitle(locationData);
      if (title) {
        const convertedTitle = convertToLatin(title);
        return this.locationRepository.createLocation({
          ...locationDto,
          title: convertedTitle,
          currency_code: currencyCode,
        });
      }
    }

    return this.locationRepository.createLocation({
      ...locationDto,
      currency_code: currencyCode,
    });
  }

  getLocationData = async (latitude: number, longitude: number) => {
    try {
      const [location] = await this.geocoderService.reverse({
        lat: latitude,
        lon: longitude,
      });
      return location;
    } catch (error) {
      this.logger.error(error);
      return;
    }
  };

  getLocationTitle = (location: any): string => {
    if (!location.streetName || !location.streetNumber) return location.city;

    return `${location.streetName} ${location.streetNumber}, ${location.city}`;
  };
}
