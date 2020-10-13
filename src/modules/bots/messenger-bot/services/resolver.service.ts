import { Injectable, Logger } from '@nestjs/common';
import { ActivityService } from 'modules/activity/activity.service';
import { FIRST_PAGE } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { ParticipationService } from 'modules/participation/participation.service';
import { State } from 'modules/state/state.dto';
import { StateService } from 'modules/state/state.service';
import { User } from 'modules/user/user.dto';
import { UserService } from 'modules/user/user.service';
import { ResponseService } from './response.service';

@Injectable()
export class ResolverService {
  private readonly logger = new Logger(ResolverService.name);

  constructor(
    private readonly activityService: ActivityService,
    private readonly participationService: ParticipationService,
    private readonly responseService: ResponseService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
  ) {}

  addRemainingVacancies = async (activityId: string, organizerId: number) => {
    try {
      const locale = await this.userService.getLocale(organizerId);
      const updatedActivity = await this.activityService.addRemainingVacancies(
        activityId,
        organizerId,
      );
      return this.responseService.getUpdateRemainingVacanciesSuccessResponse(
        updatedActivity,
        locale,
      );
    } catch {
      const locale = await this.userService.getLocale(organizerId);
      return this.responseService.getUpdateRemainingVacanciesFailureResponse(
        locale,
      );
    }
  };

  cancelActivity = async (
    activityId: string,
    organizerId: number,
  ): Promise<string | string[]> => {
    try {
      const locale = await this.userService.getLocale(organizerId);
      await this.activityService.cancelActivity(activityId, organizerId);
      return this.responseService.getCancelActivitySuccessResponse(locale);
    } catch {
      const locale = await this.userService.getLocale(organizerId);
      return this.responseService.getCancelActivityFailureResponse(locale);
    }
  };

  cancelParticipation = async (
    activityId: string,
    userId: number,
  ): Promise<string | string[]> => {
    try {
      const locale = await this.userService.getLocale(userId);
      await this.participationService.cancelParticipation(activityId, userId);
      return this.responseService.getCancelParticipationSuccessResponse(locale);
    } catch {
      const locale = await this.userService.getLocale(userId);
      return this.responseService.getCancelParticipationFailureResponse(locale);
    }
  };

  createActivity = async (newActivity: any) => {
    await this.activityService.createActivity(newActivity);

    return this.responseService.messages[this.stateService.states.closing];
  };

  getCreatedActivities = async (userId: number, page = FIRST_PAGE) => {
    const activityListData = await this.activityService.getCreatedActivities(
      userId,
      page,
    );

    return this.responseService.getCreatedActivitiesResponse({
      ...activityListData,
      page,
    });
  };

  getCurrentState = async (userId: number): Promise<State> =>
    this.stateService.getCurrentState(userId);

  getJoinedActivities = async (userId: number, page = FIRST_PAGE) => {
    const activityListData = await this.activityService.getJoinedActivities(
      userId,
      page,
    );

    return this.responseService.getJoinedActivitiesResponse({
      ...activityListData,
      page,
    });
  };

  getOrganizer = async (id: number) => {
    const organizer = await this.userService.getOrganizer(id);

    return this.responseService.getOrganizerResponse(organizer);
  };

  getParticipantList = async (id: string) => {
    const participantList = await this.userService.getParticipantList(id);

    return this.responseService.getParticipantListResponse(participantList);
  };

  getUpcomingActivities = async (userId: number, page = FIRST_PAGE) => {
    const activityListData = await this.activityService.getUpcomingActivities(
      userId,
      page,
    );

    return this.responseService.getUpcomingActivitiesResponse({
      ...activityListData,
      page,
    });
  };

  initializeActivity = async (userId: number) => {
    const initialState = {
      current_state: this.stateService.states.activity_type,
    };
    await this.stateService.updateState(userId, initialState);

    return this.responseService.getInitializeActivityResponse();
  };

  joinActivity = async (
    activityId: string,
    userId: number,
  ): Promise<string | string[]> => {
    try {
      const locale = await this.userService.getLocale(userId);
      await this.activityService.joinActivity(activityId, userId);
      return this.responseService.getJoinActivitySuccessResponse(locale);
    } catch {
      const locale = await this.userService.getLocale(userId);
      return this.responseService.getJoinActivityFailureResponse(locale);
    }
  };

  registerUser = async (userDto: User) => {
    try {
      await this.userService.registerUser(userDto);
      return this.responseService.getRegisterUserSuccessResponse(
        userDto.locale,
      );
    } catch (err) {
      this.logger.error(err);
      return this.responseService.getRegisterUserFailureResponse(
        userDto.locale,
      );
    }
  };

  resetRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ): Promise<string> => {
    try {
      const locale = await this.userService.getLocale(organizerId);
      await this.activityService.resetRemainingVacancies(
        activityId,
        organizerId,
      );
      return this.responseService.getResetRemainingVacanciesSuccessResponse(
        locale,
      );
    } catch {
      const locale = await this.userService.getLocale(organizerId);
      return this.responseService.getUpdateRemainingVacanciesFailureResponse(
        locale,
      );
    }
  };

  resetState = async (userId: number): Promise<State> =>
    this.stateService.resetState(userId);

  subtractRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ) => {
    try {
      const locale = await this.userService.getLocale(organizerId);
      const updatedActivity = await this.activityService.subtractRemainingVacancies(
        activityId,
        organizerId,
      );

      return this.responseService.getUpdateRemainingVacanciesSuccessResponse(
        updatedActivity,
        locale,
      );
    } catch {
      const locale = await this.userService.getLocale(organizerId);
      return this.responseService.getUpdateRemainingVacanciesFailureResponse(
        locale,
      );
    }
  };

  updateRemainingVacancies = async (activityId: string, userId: number) => {
    const locale = await this.userService.getLocale(userId);
    return this.responseService.getUpdateRemainingVacanciesResponse(
      activityId,
      locale,
    );
  };

  updateState = async (userId: number, updatedState: State) => {
    await this.stateService.updateState(userId, updatedState);

    return this.responseService.messages[updatedState.current_state];
  };
}
