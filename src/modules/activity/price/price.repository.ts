import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { Price } from './price.dto';
import { PriceEntity } from './price.entity';

@EntityRepository(PriceEntity)
export class PriceRepository extends Repository<PriceEntity> {
  findOrCreate = async (priceDto: Price): Promise<Price> => {
    const price = await this.findOne({
      where: {
        currency: priceDto.currency,
        value: priceDto.value,
      },
    });
    if (!price) {
      const newPrice = await this.save(priceDto);
      return plainToClass(Price, newPrice);
    }
    return plainToClass(Price, price);
  };
}
