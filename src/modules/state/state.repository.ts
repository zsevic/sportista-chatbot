import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { State } from './state.dto';
import { StateEntity } from './state.entity';

@EntityRepository(StateEntity)
export class StateRepository extends Repository<StateEntity> {
  private readonly logger = new Logger(StateRepository.name);

  getCurrentState = async (user_id: number): Promise<State> => {
    const state = await this.findOne({ where: { user_id } });
    if (!state) return null;

    return plainToClass(State, state);
  };

  initializeState = async (user_id: number): Promise<State> => {
    const state = await this.findOne({ where: { user_id } });
    if (state) {
      this.logger.log(`State for user ${user_id} is already initialized`);
      return plainToClass(State, state);
    }

    const newState = await this.save({ user_id });
    return plainToClass(State, newState);
  };

  resetState = async (user_id: number): Promise<State> => {
    const state = await this.findOne({ where: { user_id } });
    if (!state) return this.initializeState(user_id);

    const updatedState = await this.save({
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

    return plainToClass(State, updatedState);
  };

  updateState = async (user_id: number, stateDto: State): Promise<State> => {
    const state = await this.findOne({ where: { user_id } });
    if (!state) throw new Error('State is not initialized');

    const updatedState = await this.save({
      ...state,
      ...stateDto,
    });

    return plainToClass(State, updatedState);
  };
}
