import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { classTransformToDto } from 'common/decorators';
import { State } from './state.dto';
import { StateEntity } from './state.entity';

@EntityRepository(StateEntity)
@classTransformToDto(State)
export class StateRepository extends Repository<StateEntity> {
  private readonly logger = new Logger(StateRepository.name);

  async getCurrentState(user_id: number) {
    const state = await this.findOne({ where: { user_id } });
    if (!state) return null;

    return state;
  }

  async initializeState(user_id: number): Promise<StateEntity> {
    const state = await this.findOne({ where: { user_id } });
    if (!state) return this.save({ user_id });

    this.logger.log(`State for user ${user_id} is already initialized`);
    return state;
  }

  async resetState(user_id: number) {
    const state = await this.findOne({ where: { user_id } });
    if (!state) return this.initializeState(user_id);

    return this.save({
      ...state,
      current_state: null,
      activity_type: null,
      datetime: null,
      location_title: null,
      location_latitude: null,
      location_longitude: null,
      price_value: null,
      remaining_vacancies: null,
    });
  }

  async updateState(user_id: number, stateDto: State) {
    const state = await this.findOne({ where: { user_id } });
    if (!state) throw new Error('State is not initialized');

    return this.save({
      ...state,
      ...stateDto,
    });
  }
}
