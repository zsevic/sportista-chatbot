import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FIRST_PAGE } from 'common/config/constants';
import { PaginatedResponse } from 'common/dtos';
import { ParticipationRepository } from 'modules/participation/participation.repository';
import { StateRepository } from 'modules/state/state.repository';
import { DEFAULT_PRICE_CURRENCY } from './activity.constants';
import { Activity } from './activity.dto';
import { ActivityRepository } from './activity.repository';
import { LocationRepository } from './location/location.repository';
import { PriceRepository } from './price/price.repository';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly locationRepository: LocationRepository,
    private readonly participationRepository: ParticipationRepository,
    private readonly priceRepository: PriceRepository,
    private readonly stateRepository: StateRepository,
  ) {}

  addRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ): Promise<Activity> =>
    this.activityRepository.addRemainingVacancies(activityId, organizerId);

  @Transactional()
  async cancelActivity(activityId: string, organizerId: number): Promise<void> {
    await this.activityRepository.cancelActivity(activityId, organizerId);
    await this.participationRepository.removeParticipationList(activityId);
  }

  @Transactional()
  async createActivity(activity: any): Promise<void> {
    const location = await this.locationRepository.findOrCreate({
      latitude: activity.location_latitude,
      longitude: activity.location_longitude,
      title: activity.location_title,
    });
    const price = await this.priceRepository.findOrCreate({
      value: activity.price,
      currency: DEFAULT_PRICE_CURRENCY,
    });
    await this.activityRepository.createActivity({
      organizer_id: activity.organizer_id,
      location_id: location.id,
      price_id: price.id,
      datetime: activity.datetime,
      remaining_vacancies: activity.remaining_vacancies,
      type: activity.type,
    });
    await this.stateRepository.resetState(activity.organizer_id);
  }

  getCreatedActivities = async (
    organizerId: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> =>
    this.activityRepository.getCreatedActivities(organizerId, page);

  getJoinedActivities = async (
    participantId: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> =>
    this.activityRepository.getJoinedActivities(participantId, page);

  getUpcomingActivities = async (
    userId: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> =>
    this.activityRepository.getUpcomingActivities(userId, page);

  @Transactional()
  async joinActivity(activityId: string, userId: number): Promise<void> {
    await this.validateRemainingVacancies(activityId);
    await this.participationRepository.createParticipation(activityId, userId);
    await this.activityRepository.subtractRemainingVacancies(activityId);
  }

  resetRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ): Promise<Activity> =>
    this.activityRepository.resetRemainingVacancies(activityId, organizerId);

  subtractRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ): Promise<Activity> =>
    this.activityRepository.subtractRemainingVacancies(activityId, organizerId);

  validateRemainingVacancies = async (activityId: string): Promise<void> =>
    this.activityRepository.validateRemainingVacancies(activityId);
}
