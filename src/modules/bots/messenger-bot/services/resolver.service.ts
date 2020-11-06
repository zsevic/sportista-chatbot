import { Injectable, Logger } from '@nestjs/common';
import { FIRST_PAGE } from 'common/config/constants';
import { PaginatedResponse } from 'common/dtos';
import { Activity } from 'modules/activity/activity.dto';
import { ActivityService } from 'modules/activity/activity.service';
import {
  BOT_CANCEL_PARTICIPATION_NOTIFICATION,
  BOT_JOIN_ACTIVITY_NOTIFICATION,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { I18nOptions } from 'modules/bots/messenger-bot/messenger-bot.types';
import { Feedback } from 'modules/feedback/feedback.dto';
import { FeedbackService } from 'modules/feedback/feedback.service';
import { NotificationService } from 'modules/notification/notification.service';
import { Participation } from 'modules/participation/participation.dto';
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
    private readonly feedbackService: FeedbackService,
    private readonly notificationService: NotificationService,
    private readonly participationService: ParticipationService,
    private readonly responseService: ResponseService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
    private readonly validationService: ValidationService,
  ) {}

  acceptParticipation = async (
    participationId: string,
    organizerId: number,
    options: I18nOptions,
  ): Promise<string> => {
    try {
      await this.participationService.acceptParticipation(
        participationId,
        organizerId,
      );
      return this.responseService.getAcceptParticipationSuccessResponse(
        options.locale,
      );
    } catch {
      return this.responseService.getAcceptParticipationFailureResponse(
        options.locale,
      );
    }
  };

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

  applyForActivity = async (
    activityId: string,
    userId: number,
    options: I18nOptions,
  ): Promise<string | string[]> => {
    try {
      await this.activityService
        .applyForActivity(activityId, userId)
        .then(async () =>
          this.notificationService.notifyOrganizerAboutParticipantUpdate(
            activityId,
            userId,
            BOT_JOIN_ACTIVITY_NOTIFICATION,
          ),
        );
      return this.responseService.getJoinActivitySuccessResponse(options);
    } catch {
      return this.responseService.getJoinActivityFailureResponse(
        options.locale,
      );
    }
  };

  cancelActivity = async (
    activityId: string,
    organizerId: number,
    locale: string,
  ): Promise<string | string[]> => {
    try {
      const [
        participationList,
        participantCount,
      ] = await this.participationService.getParticipationListAndCount(
        activityId,
      );
      await this.activityService.cancelActivity(activityId, organizerId);
      const response = this.responseService.getCancelActivitySuccessResponse(
        locale,
      );
      if (participantCount > 0) {
        await this.notificationService.notifyParticipantsAboutCanceledActivity(
          participationList,
        );
        const notifyParticipantsResponse = this.responseService.getNotifyParticipantsResponse(
          locale,
          participantCount,
        );
        return [response, notifyParticipantsResponse];
      }
      return response;
    } catch {
      return this.responseService.getCancelActivityFailureResponse(locale);
    }
  };

  cancelParticipation = async (
    activityId: string,
    userId: number,
    options: I18nOptions,
  ): Promise<string | string[]> => {
    try {
      await this.participationService
        .cancelParticipation(activityId, userId)
        .then(async () =>
          this.notificationService.notifyOrganizerAboutParticipantUpdate(
            activityId,
            userId,
            BOT_CANCEL_PARTICIPATION_NOTIFICATION,
          ),
        );
      return this.responseService.getCancelParticipationSuccessResponse(
        options,
      );
    } catch {
      return this.responseService.getCancelParticipationFailureResponse(
        options.locale,
      );
    }
  };

  createActivity = async (newActivity: any, locale: string) => {
    await this.activityService
      .createActivity(newActivity)
      .then((createdActivity: Activity) =>
        this.notificationService.notifySubscribedUsersAboutNewActivityNearby(
          createdActivity,
        ),
      );

    return this.responseService.getCreateActivityResponse(locale);
  };

  createFeedback = async (
    feedbackDto: Feedback,
    locale: string,
  ): Promise<string> => {
    await this.feedbackService.createFeedback(feedbackDto);

    return this.responseService.getCreateFeedbackResponse(locale);
  };

  getAboutMeResponse = async (userId: number) => {
    const locale = await this.userService.getLocale(userId);
    return this.responseService.getAboutMeResponse(locale);
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
      { locale, timezone },
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
      { locale, timezone },
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

  getReceivedParticipationRequestList = async (
    userId: number,
    page = FIRST_PAGE,
  ) => {
    const userData = await this.userService.getUser(userId);

    const [
      requestList,
      total,
    ] = await this.participationService.getReceivedRequestList(userId, page);
    const result = {
      results: requestList,
      page,
      total,
    };

    return this.responseService.getReceivedParticipationRequestListResponse(
      result,
      userData,
    );
  };

  getSentParticipationRequestList = async (
    userId: number,
    page = FIRST_PAGE,
  ) => {
    const userData = await this.userService.getUser(userId);

    const [
      requestList,
      total,
    ] = await this.participationService.getSentRequestList(userId, page);
    const activities = requestList.reduce(
      (
        acc: PaginatedResponse<Activity>,
        current: Participation,
      ): PaginatedResponse<Activity> => {
        acc.results.push(current.activity);
        return acc;
      },
      { results: [], page, total },
    );

    return this.responseService.getSentParticipationRequestListResponse(
      activities,
      userData,
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
        locale,
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

  handleNotificationSubscription = async (userId: number) => {
    const { is_subscribed, locale } = await this.userService.getUser(userId);
    if (!is_subscribed) {
      await this.stateService.updateState(userId, {
        current_state: this.stateService.states.subscribe_to_notifications,
      });
      return this.responseService.getSubscribeToNotificationsResponse(locale);
    }

    await this.stateService.updateState(userId, {
      current_state: this.stateService.states.unsubscribe_to_notifications,
    });
    return this.responseService.getUnsubscribeToNotificationsResponse(locale);
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

  initializeFeedback = async (userId: number) => {
    const locale = await this.userService.getLocale(userId);

    await this.stateService.updateState(userId, {
      current_state: this.stateService.states.initialize_feedback,
    });

    return this.responseService.getInitializeFeedbackResponse(locale);
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

  subscribeToNotifications = async (userId: number): Promise<string> => {
    const locale = await this.userService.getLocale(userId);
    try {
      await this.userService.subscribeToNotifications(userId);

      return this.responseService.getSubscribeToNotificationsSuccessResponse(
        locale,
      );
    } catch {
      return this.responseService.getSubscribeToNotificationsFailureResponse(
        locale,
      );
    }
  };

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

  unsubscribeToNotifications = async (userId: number): Promise<string> => {
    const locale = await this.userService.getLocale(userId);
    try {
      await this.userService.unsubscribeToNotifications(userId);

      return this.responseService.getUnsubscribeToNotificationsSuccessResponse(
        locale,
      );
    } catch {
      return this.responseService.getUnsubscribeToNotificationsFailureResponse(
        locale,
      );
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

  updateUserLocation = async (userId: number) => {
    const locale = await this.userService.getLocale(userId);

    return this.responseService.getUserLocationI18n(locale);
  };
}
