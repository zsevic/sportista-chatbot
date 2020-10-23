import { EntityRepository, Repository } from 'typeorm';
import { Price } from './price.dto';
import { PriceEntity } from './price.entity';

@EntityRepository(PriceEntity)
export class PriceRepository extends Repository<PriceEntity> {
  async findOrCreate(priceDto: Price): Promise<PriceEntity> {
    const price = await this.findOne({
      where: {
        currency_code: priceDto.currency_code,
        value: priceDto.value,
      },
    });
    if (!price) return this.save(priceDto);

    return price;
  }
}
