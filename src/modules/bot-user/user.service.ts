import { Injectable } from '@nestjs/common';
import geoTz from 'geo-tz';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { PINNED_LOCATION } from 'modules/location/location.constants';
import { LocationService } from 'modules/location/location.service';
import { BotUser } from './user.dto';
import { BotUserRepository } from './user.repository';

@Injectable()
export class BotUserService {
  constructor(
    private readonly locationService: LocationService,
    private readonly userRepository: BotUserRepository,
  ) {}

  getLocale = async (userId: number): Promise<string> => {
    const user = await this.userRepository.findOne(userId, {
      select: ['locale'],
    });
    if (!user) throw new Error("User doesn't exist");

    return user.locale;
  };

  getLocation = async (userId: number): Promise<string> => {
    const user = await this.userRepository.findOne(userId, {
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

  getUser = async (id: number): Promise<BotUser> =>
    this.userRepository.getUser(id);

  registerUser = async (user: BotUser): Promise<BotUser> =>
    this.userRepository.registerUser(user);

  subscribeToNotifications = async (userId: number): Promise<BotUser> =>
    this.userRepository.subscribeToNotifications(userId);

  unsubscribeToNotifications = async (userId: number): Promise<BotUser> =>
    this.userRepository.unsubscribeToNotifications(userId);

  @Transactional()
  async upsertLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    const location = await this.locationService.findOrCreate({
      latitude,
      longitude,
      title: PINNED_LOCATION,
    });
    await this.userRepository.upsertLocation(userId, location.id);
    const timezone = geoTz(latitude, longitude);
    if (timezone.length === 0) throw new Error('Timezone is not valid');
    await this.userRepository.upsertTimezone(userId, timezone[0]);
  }

  validateUser = async (id: number): Promise<BotUser> =>
    this.userRepository.validateUser(id);
}
