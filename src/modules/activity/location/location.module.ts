import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocoderService, LocationService } from './services';
import { LocationRepository } from './location.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LocationRepository])],
  providers: [LocationService, GeocoderService],
  exports: [LocationService],
})
export class LocationModule {}
