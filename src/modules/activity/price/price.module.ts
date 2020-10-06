import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceRepository } from './price.repository';
import { PriceService } from './price.service';

@Module({
  imports: [TypeOrmModule.forFeature([PriceRepository])],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
