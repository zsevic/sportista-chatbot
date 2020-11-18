import { Injectable, Logger } from '@nestjs/common';
import { MessengerContext, MessengerTypes } from 'bottender';
import { FIRST_PAGE } from 'common/config/constants';
import { PaginatedResponse } from 'common/dtos';
import { Activity } from 'modules/activity/activity.dto';
import { ActivityService } from 'modules/activity/activity.service';
import {
  BOT_ACCEPTED_PARTICIPATION_NOTIFICATION,
  BOT_REJECTED_PARTICIPATION_NOTIFICATION,
  CANCEL_ACCEPTED_PARTICIPATION_TYPE,
  CANCEL_PENDING_PARTICIPATION_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { states } from 'modules/bots/messenger-bot/messenger-bot.states';
import {
  ButtonTemplate,
  I18nOptions,
} from 'modules/bots/messenger-bot/messenger-bot.types';
import { getUserOptions } from 'modules/bots/messenger-bot/messenger-bot.utils';
import { FeedbackService } from 'modules/feedback/feedback.service';
import { NotificationService } from 'modules/notification/notification.service';
import { Participation } from 'modules/participation/participation.dto';
import { ParticipationService } from 'modules/participation/participation.service';
import { BotUser } from 'modules/bot-user/user.dto';
import { BotUserService } from 'modules/bot-user/user.service';
import { BotUserOptions } from 'modules/bot-user/user.types';
import { ResponseService } from './response.service';
import { ValidationService } from './validation.service';

@Injectable()
export class ResolverService {
  private readonly logger = new Logger(ResolverService.name);
  private readonly cancelParticipationFunctions = {
    [CANCEL_ACCEPTED_PARTICIPATION_TYPE]: this.participationService
      .cancelAcceptedParticipation,
    [CANCEL_PENDING_PARTICIPATION_TYPE]: this.participationService
      .cancelPendingParticipation,
  };

  constructor(
    private readonly activityService: ActivityService,
    private readonly feedbackService: FeedbackService,
    private readonly notificationService: NotificationService,
    private readonly participationService: ParticipationService,
    private readonly responseService: ResponseService,
    private readonly userService: BotUserService,
    private readonly validationService: ValidationService,
  ) {}

  acceptParticipation = async (
    participationId: string,
    organizerOptions: BotUserOptions,
    locale: string,
  ): Promise<string> => {
    try {
      await this.participationService
        .acceptParticipation(participationId, organizerOptions)
        .then(async () =>
          this.notificationService.notifyParticipantAboutParticipationUpdate(
            participationId,
            BOT_ACCEPTED_PARTICIPATION_NOTIFICATION,
          ),
        );
      return this.responseService.getAcceptParticipationSuccessResponse(locale);
    } catch {
      return this.responseService.getAcceptParticipationFailureResponse(locale);
    }
  };

  addRemainingVacancies = async (
    activityId: string,
    organizerOptions: BotUserOptions,
    locale: string,
  ) => {
    try {
      const updatedActivity = await this.activityService.addRemainingVacancies(
        activityId,
        organizerOptions,
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
    userOptions: BotUserOptions,
    i18nOptions: I18nOptions,
  ): Promise<string | string[]> => {
    try {
      await this.activityService
        .applyForActivity(activityId, userOptions)
        .then(async (participation: Participation) =>
          this.notificationService.notifyOrganizerAboutParticipantApplication(
            participation.id,
          ),
        );
      return this.responseService.getApplyForActivitySuccessResponse(
        i18nOptions,
      );
    } catch {
      return this.responseService.getApplyForActivityFailureResponse(
        i18nOptions.locale,
      );
    }
  };

  cancelParticipation = async (
    type: string,
    activityId: string,
    participantOptions: BotUserOptions,
    i18nOptions: I18nOptions,
  ): Promise<string | string[]> => {
    try {
      await this.cancelParticipationFunctions[type]
        .call(this.participationService, activityId, participantOptions)
        .then(async (participation: Participation) =>
          this.notificationService.notifyOrganizerAboutParticipantCancelation(
            participation.id,
          ),
        );
      return this.responseService.getCancelParticipationSuccessResponse(
        i18nOptions,
      );
    } catch {
      return this.responseService.getCancelParticipationFailureResponse(
        i18nOptions.locale,
      );
    }
  };

  cancelActivity = async (
    activityId: string,
    organizerOptions: BotUserOptions,
    locale: string,
  ): Promise<string | string[]> => {
    try {
      const [
        participationList,
        participantCount,
      ] = await this.participationService.getParticipationListAndCount(
        activityId,
      );
      await this.activityService.cancelActivity(activityId, organizerOptions);
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

  createActivity = async (
    context: MessengerContext,
    userId: string,
    locale: string,
  ) => {
    const newActivity = {
      datetime: context.state.activity.datetime,
      organizer_id: userId,
      location_title: context.state.activity.location_title,
      location_latitude: context.state.activity.location_latitude,
      location_longitude: context.state.activity.location_longitude,
      price: context.state.activity.price,
      remaining_vacancies: +context.event.text,
      type: context.state.activity.type,
    };

    await this.activityService
      .createActivity(newActivity)
      .then((createdActivity: Activity) =>
        this.notificationService.notifySubscribedUsersAboutNewActivityNearby(
          createdActivity,
        ),
      );
    context.resetState();

    return this.responseService.getCreateActivityResponse(locale);
  };

  createFeedback = async (
    context: MessengerContext,
    locale: string,
  ): Promise<string> => {
    const {
      event: { text },
    } = context;
    const userOptions = getUserOptions(context);
    await this.feedbackService.createFeedback(text, userOptions);
    context.resetState();

    return this.responseService.getCreateFeedbackResponse(locale);
  };

  getAboutMeResponse = async (userOptions: BotUserOptions) => {
    const locale = await this.userService.getLocale(userOptions);
    return this.responseService.getAboutMeResponse(locale);
  };

  getCreatedActivities = async (
    organizerOptions: BotUserOptions,
    page = FIRST_PAGE,
  ) => {
    const { locale, timezone } = await this.userService.getUser(
      organizerOptions,
    );
    const activityListData = await this.activityService.getCreatedActivities(
      organizerOptions,
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

  getDefaultResponse = (locale: string): MessengerTypes.TextMessage =>
    this.responseService.getDefaultResponse(locale);

  getJoinedActivities = async (
    participantOptions: BotUserOptions,
    page = FIRST_PAGE,
  ) => {
    const { id: userId, locale, timezone } = await this.userService.getUser(
      participantOptions,
    );
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

  getOrganizer = async (id: string) => {
    const options = { id };
    const organizer = await this.userService.getUser(options);

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
    organizerOptions: BotUserOptions,
    page = FIRST_PAGE,
  ) => {
    const userData = await this.userService.getUser(organizerOptions);

    const [
      requestList,
      total,
    ] = await this.participationService.getReceivedRequestList(
      organizerOptions,
      page,
    );
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
    userOptions: BotUserOptions,
    page = FIRST_PAGE,
  ) => {
    const userData = await this.userService.getUser(userOptions);

    const [
      requestList,
      total,
    ] = await this.participationService.getSentRequestList(userOptions, page);
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

  getUpcomingActivities = async (
    context: MessengerContext,
    page = FIRST_PAGE,
  ) => {
    const userOptions = getUserOptions(context);
    const { locale, timezone } = await this.userService.getUser(userOptions);
    const userLocation = await this.userService.getLocation(userOptions);
    if (!userLocation) {
      context.setState({
        current_state: states.get_upcoming_activities,
      });
      return this.responseService.getUserLocationI18n(locale);
    }

    context.resetState();
    const activityListData = await this.activityService.getUpcomingActivities(
      userOptions,
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
    context: MessengerContext,
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
      const userOptions = getUserOptions(context);
      await this.userService.upsertLocation(userOptions, latitude, longitude);

      switch (context.state.current_state) {
        case states.initialize_activity:
          return this.initializeActivity(context);
        case states.get_upcoming_activities:
          return this.getUpcomingActivities(context, FIRST_PAGE);
        default:
          return this.responseService.getUpdateLocationSuccessResponse(locale);
      }
    } catch {
      return this.responseService.getInvalidUserLocationResponse(locale);
    }
  };

  handleNotificationSubscription = async (context: MessengerContext) => {
    const userOptions = getUserOptions(context);
    const { is_subscribed, locale } = await this.userService.getUser(
      userOptions,
    );
    if (!is_subscribed) {
      context.setState({
        current_state: states.subscribe_to_notifications,
      });
      return this.responseService.getSubscribeToNotificationsResponse(locale);
    }

    context.setState({
      current_state: states.unsubscribe_to_notifications,
    });
    return this.responseService.getUnsubscribeToNotificationsResponse(locale);
  };

  initializeActivity = async (context: MessengerContext) => {
    const userOptions = getUserOptions(context);
    const locale = await this.userService.getLocale(userOptions);

    const userLocation = await this.userService.getLocation(userOptions);
    if (!userLocation) {
      context.setState({
        current_state: states.initialize_activity,
      });
      return this.responseService.getUserLocationI18n(locale);
    }

    context.setState({
      activity: {},
      current_state: states.activity_type,
    });

    return this.responseService.getInitializeActivityResponse(locale);
  };

  initializeFeedback = async (context: MessengerContext) => {
    const userOptions = getUserOptions(context);
    const locale = await this.userService.getLocale(userOptions);

    context.setState({
      current_state: states.initialize_feedback,
    });

    return this.responseService.getInitializeFeedbackResponse(locale);
  };

  registerUser = async (
    userDto: BotUser,
    userOptions: BotUserOptions,
  ): Promise<MessengerTypes.TextMessage | ButtonTemplate> => {
    try {
      await this.userService.registerUser(userDto, userOptions);
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

  rejectParticipation = async (
    participationId: string,
    organizerOptions: BotUserOptions,
    locale: string,
  ): Promise<string> => {
    try {
      await this.participationService
        .rejectParticipation(participationId, organizerOptions)
        .then(async () =>
          this.notificationService.notifyParticipantAboutParticipationUpdate(
            participationId,
            BOT_REJECTED_PARTICIPATION_NOTIFICATION,
          ),
        );
      return this.responseService.getRejectParticipationSuccessResponse(locale);
    } catch {
      return this.responseService.getRejectParticipationFailureResponse(locale);
    }
  };

  resetRemainingVacancies = async (
    activityId: string,
    organizerOptions: BotUserOptions,
    locale: string,
  ): Promise<string> => {
    try {
      await this.activityService.resetRemainingVacancies(
        activityId,
        organizerOptions,
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

  subscribeToNotifications = async (
    userOptions: BotUserOptions,
  ): Promise<string> => {
    const locale = await this.userService.getLocale(userOptions);
    try {
      await this.userService.subscribeToNotifications(userOptions);

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
    organizerOptions: BotUserOptions,
    locale: string,
  ) => {
    try {
      const updatedActivity = await this.activityService.subtractRemainingVacancies(
        activityId,
        organizerOptions,
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

  unsubscribeToNotifications = async (
    userOptions: BotUserOptions,
  ): Promise<string> => {
    const locale = await this.userService.getLocale(userOptions);
    try {
      await this.userService.unsubscribeToNotifications(userOptions);

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

  updateUserLocation = async (userOptions: BotUserOptions) => {
    const locale = await this.userService.getLocale(userOptions);

    return this.responseService.getUserLocationI18n(locale);
  };
}
