import { Injectable } from '@nestjs/common';
import { State } from './state.dto';
import { StateRepository } from './state.repository';

@Injectable()
export class StateService {
  constructor(private readonly stateRepository: StateRepository) {}

  getCurrentState = async (userId: number): Promise<State> =>
    this.stateRepository.getCurrentState(userId);

  resetState = async (userId: number): Promise<State> =>
    this.stateRepository.resetState(userId);

  updateState = async (userId: number, state: State): Promise<State> =>
    this.stateRepository.updateState(userId, state);
}
