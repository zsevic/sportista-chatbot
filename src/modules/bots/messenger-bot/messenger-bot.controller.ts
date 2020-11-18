import { Controller } from '@nestjs/common';
import { MessengerContext } from 'bottender';
import {
  DEFAULT_MESSENGER_GENDER,
  DEFAULT_MESSENGER_LOCALE,
} from 'common/config/constants';
import {
  ABOUT_ME_PAYLOAD,
  CREATED_ACTIVITIES_PAYLOAD,
  GET_STARTED_PAYLOAD,
  INITIALIZE_ACTIVITY_PAYLOAD,
  INITIALIZE_FEEDBACK_PAYLOAD,
  JOINED_ACTIVITIES_PAYLOAD,
  NOTIFICATION_SUBSCRIPTION_PAYLOAD,
  RECEIVED_PARTICIPATION_REQUESTS_PAYLOAD,
  SENT_PARTICIPATION_REQUESTS_PAYLOAD,
  SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  UPCOMING_ACTIVITIES_PAYLOAD,
  UPDATE_USER_LOCATION_PAYLOAD,
} from './messenger-bot.constants';
import { PayloadHandlers } from './messenger-bot.types';
import { getUserOptions } from './messenger-bot.utils';
import { LocationService } from './services/location.service';
import { MessageService } from './services/message.service';
import { PostbackService } from './services/postback.service';
import { ResolverService } from './services/resolver.service';

@Controller()
export class MessengerBotController {
  constructor(
    private readonly locationService: LocationService,
    private readonly messageService: MessageService,
    private readonly postbackService: PostbackService,
    private readonly resolverService: ResolverService,
  ) {}

  private aboutMeHandler = async (context: MessengerContext) => {
    const userOptions = getUserOptions(context);
    return this.resolverService.getAboutMeResponse(userOptions);
  };

  private createdActivitiesHandler = async (context: MessengerContext) => {
    const organizerOptions = getUserOptions(context);
    return this.resolverService.getCreatedActivities(organizerOptions);
  };

  private getStartedButtonHandler = async (context: MessengerContext) => {
    const {
      firstName,
      gender = DEFAULT_MESSENGER_GENDER,
      lastName,
      locale = DEFAULT_MESSENGER_LOCALE,
      profilePic: image_url,
    } = await context.getUserProfile({
      fields: [
        'id',
        'first_name',
        'gender',
        'last_name',
        'locale',
        'profile_pic',
      ],
    });
    const userOptions = getUserOptions(context);
    return this.resolverService.registerUser(
      {
        ...userOptions,
        first_name: firstName,
        gender,
        image_url,
        last_name: lastName,
        locale,
      },
      userOptions,
    );
  };

  private initializeActivityHandler = async (context: MessengerContext) =>
    this.resolverService.initializeActivity(context);

  private initializeFeedbackHandler = async (context: MessengerContext) =>
    this.resolverService.initializeFeedback(context);

  private joinedActivitiesHandler = async (context: MessengerContext) => {
    const participantOptions = getUserOptions(context);
    return this.resolverService.getJoinedActivities(participantOptions);
  };

  private locationHandler = async (context: MessengerContext) =>
    this.locationService.handleLocation(context);

  messageHandler = async (context: MessengerContext) => {
    const { event } = context;
    if (event.isLocation) {
      return this.locationHandler(context);
    }

    if (this.quickReplyHandlers[event.quickReply?.payload])
      return this.quickReplyHandlers[event.quickReply.payload](context);

    return this.messageService.handleMessage(context);
  };

  private notificationSubscriptionHandler = async (context: MessengerContext) =>
    this.resolverService.handleNotificationSubscription(context);

  postbackHandler = async (context: MessengerContext) => {
    const {
      event: {
        postback: { payload: buttonPayload },
      },
    } = context;

    if (this.postbackHandlers[buttonPayload])
      return this.postbackHandlers[buttonPayload](context);

    return this.postbackService.handlePostback(context);
  };

  private receivedParticipationRequestsHandler = async (
    context: MessengerContext,
  ) => {
    const organizerOptions = getUserOptions(context);
    return this.resolverService.getReceivedParticipationRequestList(
      organizerOptions,
    );
  };

  private sentParticipationRequestsHandler = async (
    context: MessengerContext,
  ) => {
    const userOptions = getUserOptions(context);
    return this.resolverService.getSentParticipationRequestList(userOptions);
  };

  private subscribeToNotificationsHandler = async (
    context: MessengerContext,
  ) => {
    const userOptions = getUserOptions(context);
    const response = await this.resolverService.subscribeToNotifications(
      userOptions,
    );
    context.resetState();

    return response;
  };

  private unsubscribeToNotificationsHandler = async (
    context: MessengerContext,
  ) => {
    const userOptions = getUserOptions(context);
    const response = await this.resolverService.unsubscribeToNotifications(
      userOptions,
    );
    context.resetState();

    return response;
  };

  private upcomingActivitiesHandler = async (context: MessengerContext) =>
    this.resolverService.getUpcomingActivities(context);

  private updateUserLocationHandler = async (context: MessengerContext) => {
    const userOptions = getUserOptions(context);
    return this.resolverService.updateUserLocation(userOptions);
  };

  postbackHandlers: PayloadHandlers = {
    [ABOUT_ME_PAYLOAD]: this.aboutMeHandler,
    [CREATED_ACTIVITIES_PAYLOAD]: this.createdActivitiesHandler,
    [GET_STARTED_PAYLOAD]: this.getStartedButtonHandler,
    [INITIALIZE_ACTIVITY_PAYLOAD]: this.initializeActivityHandler,
    [INITIALIZE_FEEDBACK_PAYLOAD]: this.initializeFeedbackHandler,
    [JOINED_ACTIVITIES_PAYLOAD]: this.joinedActivitiesHandler,
    [NOTIFICATION_SUBSCRIPTION_PAYLOAD]: this.notificationSubscriptionHandler,
    [RECEIVED_PARTICIPATION_REQUESTS_PAYLOAD]: this
      .receivedParticipationRequestsHandler,
    [SENT_PARTICIPATION_REQUESTS_PAYLOAD]: this
      .sentParticipationRequestsHandler,
    [SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD]: this.subscribeToNotificationsHandler,
    [UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD]: this
      .unsubscribeToNotificationsHandler,
    [UPCOMING_ACTIVITIES_PAYLOAD]: this.upcomingActivitiesHandler,
    [UPDATE_USER_LOCATION_PAYLOAD]: this.updateUserLocationHandler,
  };

  quickReplyHandlers: PayloadHandlers = {
    [CREATED_ACTIVITIES_PAYLOAD]: this.createdActivitiesHandler,
    [INITIALIZE_ACTIVITY_PAYLOAD]: this.initializeActivityHandler,
    [JOINED_ACTIVITIES_PAYLOAD]: this.joinedActivitiesHandler,
    [UPCOMING_ACTIVITIES_PAYLOAD]: this.upcomingActivitiesHandler,
  };
}
