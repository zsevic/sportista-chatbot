import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Location } from './location.dto';
import { LocationEntity } from './location.entity';

@EntityRepository(LocationEntity)
export class LocationRepository extends Repository<LocationEntity> {
  findLocation = async (
    latitude: number,
    longitude: number,
  ): Promise<Location> => {
    const location = await this.findOne({
      where: {
        latitude,
        longitude,
      },
    });
    if (!location) return;

    return plainToClass(Location, location);
  };

  createLocation = async (locationDto: Location): Promise<Location> => {
    const location = await this.save(locationDto);

    return plainToClass(Location, location);
  };
}
