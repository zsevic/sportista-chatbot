import { EntityRepository, Repository } from 'typeorm';
import { classTransformToDto } from 'common/decorators';
import { Price } from './price.dto';
import { PriceEntity } from './price.entity';

@EntityRepository(PriceEntity)
@classTransformToDto(Price)
export class PriceRepository extends Repository<PriceEntity> {
  async findOrCreate(priceDto: Price): Promise<PriceEntity> {
    const price = await this.findOne({
      where: {
        currency: priceDto.currency,
        value: priceDto.value,
      },
    });
    if (!price) return this.save(priceDto);

    return price;
  }
}
