import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FIRST_PAGE } from 'common/config/constants';
import { PaginatedResponse } from 'common/dtos';
import { LocationService } from 'modules/location/location.service';
import { ParticipationRepository } from 'modules/participation/participation.repository';
import { BotUser } from 'modules/bot-user/user.dto';
import { BotUserRepository } from 'modules/bot-user/user.repository';
import { BotUserOptions } from 'modules/bot-user/user.types';
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
    private readonly userRepository: BotUserRepository,
  ) {}

  addRemainingVacancies = async (
    activityId: string,
    organizerOptions: BotUserOptions,
  ): Promise<Activity> =>
    this.activityRepository.addRemainingVacancies(activityId, organizerOptions);

  @Transactional()
  async cancelActivity(
    activityId: string,
    organizerOptions: BotUserOptions,
  ): Promise<void> {
    await this.activityRepository.cancelActivity(activityId, organizerOptions);
    await this.participationRepository.removeParticipationList(activityId);
  }

  @Transactional()
  async createActivity(activity: any): Promise<Activity> {
    const location = await this.locationService.findOrCreate({
      latitude: activity.location_latitude,
      longitude: activity.location_longitude,
      title: activity.location_title,
    });
    const price = await this.priceRepository.findOrCreate({
      value: activity.price,
      currency_code: location.currency_code,
    });
    const createdActivity = await this.activityRepository.createActivity({
      organizer_id: activity.organizer_id,
      location_id: location.id,
      price_id: price.id,
      datetime: activity.datetime,
      remaining_vacancies: activity.remaining_vacancies,
      type: activity.type,
    });

    return { ...createdActivity, location, price };
  }

  getCreatedActivities = async (
    organizerOptions: BotUserOptions,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> =>
    this.activityRepository.getCreatedActivities(organizerOptions, page);

  getJoinedActivities = async (
    userId: string,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> =>
    this.activityRepository.getJoinedActivities(userId, page);

  @Transactional()
  async getUpcomingActivities(
    userOptions: BotUserOptions,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> {
    const userLocation = await this.userRepository.getLocation(userOptions);
    return this.activityRepository.getUpcomingActivities(userLocation, page);
  }

  @Transactional()
  async applyForActivity(activityId: string, userOptions: BotUserOptions) {
    const { location } = await this.activityRepository.findOne(activityId, {
      relations: ['location'],
    });
    const user = await this.userRepository.validateActivityLocation(
      userOptions,
      location.latitude,
      location.longitude,
    );
    if (!user) throw new Error('Location is not valid');
    return this.participationRepository.createParticipation(
      activityId,
      user.id,
    );
  }

  resetRemainingVacancies = async (
    activityId: string,
    organizerOptions: BotUserOptions,
  ): Promise<Activity> =>
    this.activityRepository.resetRemainingVacancies(
      activityId,
      organizerOptions,
    );

  subtractRemainingVacancies = async (
    activityId: string,
    organizerOptions: BotUserOptions,
  ): Promise<Activity> =>
    this.activityRepository.subtractRemainingVacancies(
      activityId,
      organizerOptions,
    );

  validateLocation = async (
    userOptions: BotUserOptions,
    latitude: number,
    longitude: number,
  ): Promise<BotUser> =>
    this.userRepository.validateActivityLocation(
      userOptions,
      latitude,
      longitude,
    );
}
