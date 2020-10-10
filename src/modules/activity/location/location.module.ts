import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './services';
import { LocationRepository } from './location.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LocationRepository])],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
