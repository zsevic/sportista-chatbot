import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { PINNED_LOCATION } from 'modules/location/location.constants';
import { Location } from 'modules/location/location.dto';
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

  @Transactional()
  async createLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    const location = await this.locationService.findOrCreate({
      latitude,
      longitude,
      title: PINNED_LOCATION,
    });
    await this.userRepository.createLocation(userId, location.id);
  }

  getLocale = async (userId: number): Promise<string> => {
    const user = await this.userRepository.findOne(userId, {
      select: ['locale'],
    });

    return user.locale;
  };

  getLocation = async (userId: number): Promise<string> => {
    const user = await this.userRepository.findOne(userId, {
      select: ['location_id'],
    });
    if (!user) return;

    return user.location_id;
  };

  getOrganizer = async (id: number): Promise<User> =>
    this.userRepository.getUser(id);

  getParticipantList = async (activityId: string): Promise<User[]> =>
    this.userRepository.getParticipantListByActivity(activityId);

  @Transactional()
  async registerUser(user: User): Promise<void> {
    await this.userRepository.registerUser(user);
    await this.stateRepository.initializeState(user.id);
  }
}
