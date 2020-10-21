import { Injectable } from '@nestjs/common';
import geoTz from 'geo-tz';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { PINNED_LOCATION } from 'modules/location/location.constants';
import { LocationService } from 'modules/location/location.service';
import { StateRepository } from 'modules/state/state.repository';
import { User } from './user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly locationService: LocationService,
    private readonly stateRepository: StateRepository,
    private readonly userRepository: UserRepository,
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

  getParticipantList = async (activityId: string): Promise<User[]> =>
    this.userRepository.getParticipantListByActivity(activityId);

  getUser = async (id: number): Promise<User> =>
    this.userRepository.getUser(id);

  @Transactional()
  async registerUser(user: User): Promise<void> {
    await this.userRepository.registerUser(user);
    await this.stateRepository.initializeState(user.id);
  }

  subscribeToNotifications = async (userId: number) =>
    this.userRepository.subscribeToNotifications(userId);

  unsubscribeToNotifications = async (userId: number) =>
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

  validateUser = async (id: number): Promise<User> =>
    this.userRepository.validateUser(id);
}
