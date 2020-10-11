import { EntityRepository, Repository } from 'typeorm';
import { classTransformToDto } from 'common/decorators';
import { Location } from './location.dto';
import { LocationEntity } from './location.entity';

@EntityRepository(LocationEntity)
@classTransformToDto(Location)
export class LocationRepository extends Repository<LocationEntity> {
  async findLocation(
    latitude: number,
    longitude: number,
  ): Promise<LocationEntity> {
    const location = await this.findOne({
      where: {
        latitude,
        longitude,
      },
    });
    if (!location) return;

    return location;
  }

  async createLocation(locationDto: Location): Promise<LocationEntity> {
    return this.save(locationDto);
  }
}
