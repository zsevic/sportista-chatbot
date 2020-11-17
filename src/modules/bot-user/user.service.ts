import { Injectable } from '@nestjs/common';
import geoTz from 'geo-tz';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { PINNED_LOCATION } from 'modules/location/location.constants';
import { LocationService } from 'modules/location/location.service';
import { BotUser } from './user.dto';
import { BotUserRepository } from './user.repository';
import { BotUserOptions } from './user.types';

@Injectable()
export class BotUserService {
  constructor(
    private readonly locationService: LocationService,
    private readonly userRepository: BotUserRepository,
  ) {}

  getLocale = async (userOptions: BotUserOptions): Promise<string> => {
    const user = await this.userRepository.findOne({
      where: userOptions,
      select: ['locale'],
    });
    if (!user) throw new Error("User doesn't exist");

    return user.locale;
  };

  getLocation = async (userOptions: BotUserOptions): Promise<string> => {
    const user = await this.userRepository.findOne({
      where: userOptions,
      select: ['location_id'],
    });
    if (!user) return;

    return user.location_id;
  };

  getParticipantList = async (activityId: string): Promise<BotUser[]> =>
    this.userRepository.getParticipantListByActivity(activityId);

  getSubscribedUsersNearby = async (
    latitude: number,
    longitude: number,
  ): Promise<BotUser[]> =>
    this.userRepository.getSubscribedUsersNearby(latitude, longitude);

  getUser = async (userOptions: BotUserOptions): Promise<BotUser> =>
    this.userRepository.getUser(userOptions);

  registerUser = async (
    userDto: BotUser,
    userOptions: BotUserOptions,
  ): Promise<BotUser> => this.userRepository.registerUser(userDto, userOptions);

  subscribeToNotifications = async (
    userOptions: BotUserOptions,
  ): Promise<BotUser> =>
    this.userRepository.subscribeToNotifications(userOptions);

  unsubscribeToNotifications = async (
    userOptions: BotUserOptions,
  ): Promise<BotUser> =>
    this.userRepository.unsubscribeToNotifications(userOptions);

  @Transactional()
  async upsertLocation(
    userOptions: BotUserOptions,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    const location = await this.locationService.findOrCreate({
      latitude,
      longitude,
      title: PINNED_LOCATION,
    });
    await this.userRepository.upsertLocation(userOptions, location.id);
    const timezone = geoTz(latitude, longitude);
    if (timezone.length === 0) throw new Error('Timezone is not valid');
    await this.userRepository.upsertTimezone(userOptions, timezone[0]);
  }

  validateUser = async (userOptions: BotUserOptions): Promise<BotUser> =>
    this.userRepository.validateUser(userOptions);
}
