import { Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ActivityService } from 'modules/activity/activity.service';
import {
  ACTIVITY_RESET_REMAINING_VACANCIES,
  ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
  FIRST_PAGE,
  USER_REGISTRATION_SUCCESS,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import {
  CANCEL_ACTIVITY_FAILURE_TEXT,
  CANCEL_ACTIVITY_SUCCESS_TEXT,
  CANCEL_PARTICIPATION_FAILURE_TEXT,
  CANCEL_PARTICIPATION_SUCCESS_TEXT,
  JOIN_ACTIVITY_FAILURE_TEXT,
  JOIN_ACTIVITY_SUCCESS_TEXT,
  NOTIFY_ORGANIZER_TEXT,
  NOTIFY_PARTICIPANTS_TEXT,
} from 'modules/bots/messenger-bot/messenger-bot.texts';
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
    private readonly i18nService: I18nService,
    private readonly participationService: ParticipationService,
    private readonly responseService: ResponseService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
  ) {}

  addRemainingVacancies = async (activityId: string, organizerId: number) => {
    let locale: string;
    try {
      const updatedActivity = await this.activityService.addRemainingVacancies(
        activityId,
        organizerId,
      );
      locale = await this.userService.getLocale(organizerId);
      return this.responseService.getUpdatedRemainingVacanciesResponse(
        updatedActivity,
        locale,
      );
    } catch {
      const lang = locale
        ? locale
        : await this.userService.getLocale(organizerId);
      return this.i18nService.translate(
        ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
        {
          lang,
        },
      );
    }
  };

  cancelActivity = async (
    activityId: string,
    organizerId: number,
  ): Promise<string | string[]> => {
    try {
      await this.activityService.cancelActivity(activityId, organizerId);
      return [CANCEL_ACTIVITY_SUCCESS_TEXT, NOTIFY_PARTICIPANTS_TEXT];
    } catch {
      return CANCEL_ACTIVITY_FAILURE_TEXT;
    }
  };

  cancelParticipation = async (
    activityId: string,
    userId: number,
  ): Promise<string | string[]> => {
    try {
      await this.participationService.cancelParticipation(activityId, userId);
      return [CANCEL_PARTICIPATION_SUCCESS_TEXT, NOTIFY_ORGANIZER_TEXT];
    } catch {
      return CANCEL_PARTICIPATION_FAILURE_TEXT;
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
      await this.activityService.joinActivity(activityId, userId);
      return [JOIN_ACTIVITY_SUCCESS_TEXT, NOTIFY_ORGANIZER_TEXT];
    } catch {
      return JOIN_ACTIVITY_FAILURE_TEXT;
    }
  };

  registerUser = async (userDto: User) => {
    try {
      await this.userService.registerUser(userDto);
      return this.i18nService.translate(USER_REGISTRATION_SUCCESS, {
        lang: userDto.locale,
      });
    } catch (err) {
      this.logger.error(err);
      return this.responseService.getRegistrationFailureResponse(
        userDto.locale,
      );
    }
  };

  resetRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ): Promise<string> => {
    let locale: string;
    try {
      locale = await this.userService.getLocale(organizerId);
      await this.activityService.resetRemainingVacancies(
        activityId,
        organizerId,
      );
      return this.i18nService.translate(ACTIVITY_RESET_REMAINING_VACANCIES, {
        lang: locale,
      });
    } catch {
      const lang = locale
        ? locale
        : await this.userService.getLocale(organizerId);
      return this.i18nService.translate(
        ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
        {
          lang,
        },
      );
    }
  };

  resetState = async (userId: number): Promise<State> =>
    this.stateService.resetState(userId);

  subtractRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ) => {
    let locale: string;
    try {
      const updatedActivity = await this.activityService.subtractRemainingVacancies(
        activityId,
        organizerId,
      );

      const locale = await this.userService.getLocale(organizerId);
      return this.responseService.getUpdatedRemainingVacanciesResponse(
        updatedActivity,
        locale,
      );
    } catch {
      const lang = locale
        ? locale
        : await this.userService.getLocale(organizerId);
      return this.i18nService.translate(
        ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
        {
          lang,
        },
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
