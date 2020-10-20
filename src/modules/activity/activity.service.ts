import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FIRST_PAGE } from 'common/config/constants';
import { PaginatedResponse } from 'common/dtos';
import { LocationService } from 'modules/location/location.service';
import { ParticipationRepository } from 'modules/participation/participation.repository';
import { StateRepository } from 'modules/state/state.repository';
import { UserRepository } from 'modules/user/user.repository';
import { Activity } from './activity.dto';
import { ActivityRepository } from './activity.repository';
import { PriceRepository } from './price/price.repository';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly locationService: LocationService,
    private readonly participationRepository: ParticipationRepository,
    private readonly priceRepository: PriceRepository,
    private readonly stateRepository: StateRepository,
    private readonly userRepository: UserRepository,
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
    const location = await this.locationService.findOrCreate({
      latitude: activity.location_latitude,
      longitude: activity.location_longitude,
      title: activity.location_title,
    });
    const price = await this.priceRepository.findOrCreate({
      value: activity.price,
      currency_code: location.currency_code,
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

  @Transactional()
  async getUpcomingActivities(
    userId: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> {
    const userLocation = await this.userRepository.getLocation(userId);
    return this.activityRepository.getUpcomingActivities(userLocation, page);
  }

  @Transactional()
  async joinActivity(activityId: string, userId: number): Promise<void> {
    const { location } = await this.activityRepository.findOne(activityId, {
      relations: ['location'],
    });
    const isValidLocation = await this.userRepository.validateActivityLocation(
      userId,
      location.latitude,
      location.longitude,
    );
    if (!isValidLocation) throw new Error('Location is not valid');
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

  validateLocation = async (
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<boolean> =>
    this.userRepository.validateActivityLocation(userId, latitude, longitude);
}
