import { Injectable } from '@nestjs/common';
import { State } from './state.dto';
import { StateRepository } from './state.repository';

@Injectable()
export class StateService {
  states = {
    initialize_activity: 'initialize_activity',
    activity_type: 'activity_type',
    datetime: 'datetime',
    location: 'location',
    price: 'price',
    remaining_vacancies: 'remaining_vacancies',
    closing: 'closing',
    user_location: 'user_location',
  };

  nextStates = {
    [this.states.activity_type]: this.states.datetime,
    [this.states.datetime]: this.states.location,
    [this.states.location]: this.states.price,
    [this.states.price]: this.states.remaining_vacancies,
    [this.states.remaining_vacancies]: this.states.closing,
  };

  constructor(private readonly stateRepository: StateRepository) {}

  getCurrentState = async (userId: number): Promise<State> =>
    this.stateRepository.getCurrentState(userId);

  resetState = async (userId: number): Promise<State> =>
    this.stateRepository.resetState(userId);

  updateState = async (userId: number, state: State): Promise<State> =>
    this.stateRepository.updateState(userId, state);
}
