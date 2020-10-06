import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Location } from './location.dto';
import { LocationEntity } from './location.entity';

@EntityRepository(LocationEntity)
export class LocationRepository extends Repository<LocationEntity> {
  findOrCreate = async (locationDto: Location): Promise<Location> => {
    const location = await this.findOne({
      where: {
        latitude: locationDto.latitude,
        longitude: locationDto.longitude,
      },
    });
    if (!location) {
      const newLocation = await this.save(locationDto);
      return plainToClass(Location, newLocation);
    }
    return plainToClass(Location, location);
  };
}
