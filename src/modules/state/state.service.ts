import { Injectable } from '@nestjs/common';
import { State } from './state.dto';
import { StateRepository } from './state.repository';

@Injectable()
export class StateService {
  states = {
    activity_type: 'activity_type',
    create_activity_closing: 'create_activity_closing',
    datetime: 'datetime',
    get_upcoming_activities: 'get_upcoming_activities',
    initialize_activity: 'initialize_activity',
    initialize_feedback: 'initialize_feedback',
    location: 'location',
    price: 'price',
    remaining_vacancies: 'remaining_vacancies',
    subscribe_to_notifications: 'subscribe_to_notifications',
    unsubscribe_to_notifications: 'unsubscribe_to_notifications',
  };

  notificationSubscriptionStates = [
    this.states.subscribe_to_notifications,
    this.states.unsubscribe_to_notifications,
  ];

  nextStates = {
    [this.states.activity_type]: this.states.datetime,
    [this.states.datetime]: this.states.location,
    [this.states.location]: this.states.price,
    [this.states.price]: this.states.remaining_vacancies,
    [this.states.remaining_vacancies]: this.states.create_activity_closing,
  };

  constructor(private readonly stateRepository: StateRepository) {}

  getCurrentState = async (userId: number): Promise<State> =>
    this.stateRepository.getCurrentState(userId);

  resetState = async (userId: number): Promise<State> =>
    this.stateRepository.resetState(userId);

  updateState = async (userId: number, state: State): Promise<State> =>
    this.stateRepository.updateState(userId, state);
}
