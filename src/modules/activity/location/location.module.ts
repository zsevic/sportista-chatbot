import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationRepository } from './location.repository';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationRepository])],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
