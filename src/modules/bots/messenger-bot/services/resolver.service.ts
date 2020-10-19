import { Injectable, Logger } from '@nestjs/common';
import { FIRST_PAGE } from 'common/config/constants';
import { ActivityService } from 'modules/activity/activity.service';
import { ParticipationService } from 'modules/participation/participation.service';
import { RESET_STATE } from 'modules/state/state.constants';
import { State } from 'modules/state/state.dto';
import { StateService } from 'modules/state/state.service';
import { User } from 'modules/user/user.dto';
import { UserService } from 'modules/user/user.service';
import { ResponseService } from './response.service';
import { ValidationService } from './validation.service';

@Injectable()
export class ResolverService {
  private readonly logger = new Logger(ResolverService.name);

  constructor(
    private readonly activityService: ActivityService,
    private readonly participationService: ParticipationService,
    private readonly responseService: ResponseService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
    private readonly validationService: ValidationService,
  ) {}

  addRemainingVacancies = async (
    activityId: string,
    organizerId: number,
    locale: string,
  ) => {
    try {
      const updatedActivity = await this.activityService.addRemainingVacancies(
        activityId,
        organizerId,
      );
      return this.responseService.getUpdateRemainingVacanciesSuccessResponse(
        updatedActivity,
        locale,
      );
    } catch {
      return this.responseService.getUpdateRemainingVacanciesFailureResponse(
        locale,
      );
    }
  };

  cancelActivity = async (
    activityId: string,
    organizerId: number,
    locale: string,
  ): Promise<string | string[]> => {
    try {
      await this.activityService.cancelActivity(activityId, organizerId);
      return this.responseService.getCancelActivitySuccessResponse(locale);
    } catch {
      return this.responseService.getCancelActivityFailureResponse(locale);
    }
  };

  cancelParticipation = async (
    activityId: string,
    userId: number,
    locale: string,
  ): Promise<string | string[]> => {
    try {
      await this.participationService.cancelParticipation(activityId, userId);
      return this.responseService.getCancelParticipationSuccessResponse(locale);
    } catch {
      return this.responseService.getCancelParticipationFailureResponse(locale);
    }
  };

  createActivity = async (newActivity: any, locale: string) => {
    await this.activityService.createActivity(newActivity);

    return this.responseService.getCreateActivityResponse(locale);
  };

  getCreatedActivities = async (userId: number, page = FIRST_PAGE) => {
    const { locale, timezone } = await this.userService.getUser(userId);
    const activityListData = await this.activityService.getCreatedActivities(
      userId,
      page,
    );

    return this.responseService.getCreatedActivitiesResponse(
      {
        ...activityListData,
        page,
      },
      { lang: locale, timezone },
    );
  };

  getCurrentState = async (userId: number): Promise<State> =>
    this.stateService.getCurrentState(userId);

  getDefaultResponse = async (locale: string) =>
    this.responseService.getDefaultResponse(locale);

  getJoinedActivities = async (userId: number, page = FIRST_PAGE) => {
    const { locale, timezone } = await this.userService.getUser(userId);
    const activityListData = await this.activityService.getJoinedActivities(
      userId,
      page,
    );

    return this.responseService.getJoinedActivitiesResponse(
      {
        ...activityListData,
        page,
      },
      { lang: locale, timezone },
    );
  };

  getOrganizer = async (id: number) => {
    const organizer = await this.userService.getUser(id);

    return this.responseService.getOrganizerResponse(organizer);
  };

  getParticipantList = async (id: string, locale: string) => {
    const participantList = await this.userService.getParticipantList(id);

    return this.responseService.getParticipantListResponse(
      participantList,
      locale,
    );
  };

  getUpcomingActivities = async (userId: number, page = FIRST_PAGE) => {
    const { locale, timezone } = await this.userService.getUser(userId);
    const userLocation = await this.userService.getLocation(userId);
    if (!userLocation) {
      await this.stateService.updateState(userId, {
        current_state: this.stateService.states.get_upcoming_activities,
      });
      return this.responseService.getUserLocationI18n(locale);
    }

    await this.stateService.resetState(userId);
    const activityListData = await this.activityService.getUpcomingActivities(
      userId,
      page,
    );

    return this.responseService.getUpcomingActivitiesResponse(
      {
        ...activityListData,
        page,
      },
      {
        lang: locale,
        timezone,
      },
    );
  };

  getUserLocation = async (
    userId: number,
    latitude: number,
    longitude: number,
    locale: string,
  ) => {
    const validationResponse = this.validationService.validateLocation([
      latitude,
      longitude,
    ]);
    if (validationResponse) {
      return this.responseService.getInvalidUserLocationResponse(locale);
    }

    try {
      await this.userService.upsertLocation(userId, latitude, longitude);

      const state = await this.stateService.getCurrentState(userId);

      switch (state.current_state) {
        case this.stateService.states.initialize_activity:
          return this.initializeActivity(state.user_id);
        case this.stateService.states.get_upcoming_activities:
          return this.getUpcomingActivities(state.user_id, FIRST_PAGE);
        default:
          return this.responseService.getUpdateLocationSuccessResponse(locale);
      }
    } catch {
      return this.responseService.getInvalidUserLocationResponse(locale);
    }
  };

  initializeActivity = async (userId: number) => {
    const locale = await this.userService.getLocale(userId);

    const userLocation = await this.userService.getLocation(userId);
    if (!userLocation) {
      await this.stateService.updateState(userId, {
        current_state: this.stateService.states.initialize_activity,
      });
      return this.responseService.getUserLocationI18n(locale);
    }

    const state = {
      current_state: this.stateService.states.activity_type,
      ...RESET_STATE,
    };
    await this.stateService.updateState(userId, state);

    return this.responseService.getInitializeActivityResponse(locale);
  };

  joinActivity = async (
    activityId: string,
    userId: number,
    locale: string,
  ): Promise<string | string[]> => {
    try {
      await this.activityService.joinActivity(activityId, userId);
      return this.responseService.getJoinActivitySuccessResponse(locale);
    } catch {
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
    locale: string,
  ): Promise<string> => {
    try {
      await this.activityService.resetRemainingVacancies(
        activityId,
        organizerId,
      );
      return this.responseService.getResetRemainingVacanciesSuccessResponse(
        locale,
      );
    } catch {
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
    locale: string,
  ) => {
    try {
      const updatedActivity = await this.activityService.subtractRemainingVacancies(
        activityId,
        organizerId,
      );

      return this.responseService.getUpdateRemainingVacanciesSuccessResponse(
        updatedActivity,
        locale,
      );
    } catch {
      return this.responseService.getUpdateRemainingVacanciesFailureResponse(
        locale,
      );
    }
  };

  updateLocale = async (userId: number, locale: string) => {
    try {
      await this.userService.updateLocale(userId, locale);
      return this.responseService.getUpdateLocaleSuccessResponse(locale);
    } catch {
      const userLocale = await this.userService.getLocale(userId);
      return this.responseService.getUpdateLocaleFailureResponse(userLocale);
    }
  };

  updateRemainingVacancies = async (activityId: string, locale: string) => {
    return this.responseService.getUpdateRemainingVacanciesResponse(
      activityId,
      locale,
    );
  };

  updateState = async (userId: number, updatedState: State, locale: string) => {
    await this.stateService.updateState(userId, updatedState);

    return this.responseService.getUpdateStateResponse(
      updatedState.current_state,
      locale,
    );
  };
}
