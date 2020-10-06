import { Injectable } from '@nestjs/common';
import { Price } from './price.dto';
import { PriceRepository } from './price.repository';

@Injectable()
export class PriceService {
  constructor(private readonly priceRepository: PriceRepository) {}

  findOrCreate = async (price: Price): Promise<Price> =>
    this.priceRepository.findOrCreate(price);
}
