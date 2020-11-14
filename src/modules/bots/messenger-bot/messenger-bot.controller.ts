import { Controller, Logger } from '@nestjs/common';
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
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import {
  isButtonTemplate,
  isGenericTemplate,
  isQuickReplyTemplate,
} from 'modules/bots/messenger-bot/messenger-bot.type-guards';
import { Message } from 'modules/bots/messenger-bot/messenger-bot.types';
import { LocationService } from './services/location.service';
import { MessageService } from './services/message.service';
import { PostbackService } from './services/postback.service';
import { ResolverService } from './services/resolver.service';

@Controller()
export class MessengerBotController {
  private readonly logger = new Logger(MessengerBotController.name);

  constructor(
    private readonly locationService: LocationService,
    private readonly messageService: MessageService,
    private readonly postbackService: PostbackService,
    private readonly resolverService: ResolverService,
  ) {}

  private aboutMeHandler = async (context: MessengerContext) => {
    const response = await this.resolverService.getAboutMeResponse(
      context._session.user.id,
    );

    return this.say(context, response);
  };

  private createdActivitiesHandler = async (context: MessengerContext) => {
    const response = await this.resolverService.getCreatedActivities(
      context._session.user.id,
    );
    return this.say(context, response);
  };

  private getStartedButtonHandler = async (context: MessengerContext) => {
    const {
      id,
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
    const response = await this.resolverService.registerUser({
      id: +id,
      first_name: firstName,
      gender,
      image_url,
      last_name: lastName,
      locale,
    });

    return this.say(context, response);
  };

  private initializeActivityHandler = async (context: MessengerContext) => {
    const response = await this.resolverService.initializeActivity(
      context._session.user.id,
    );
    return this.say(context, response);
  };

  private initializeFeedbackHandler = async (context: MessengerContext) => {
    const response = await this.resolverService.initializeFeedback(
      context._session.user.id,
    );
    return this.say(context, response);
  };

  private joinedActivitiesHandler = async (context: MessengerContext) => {
    const response = await this.resolverService.getJoinedActivities(
      context._session.user.id,
    );
    return this.say(context, response);
  };

  private locationHandler = async (context: MessengerContext) => {
    const {
      event: { location },
      _session: {
        user: { id: userId },
      },
    } = context;
    const response = await this.locationService.handleLocation(
      location,
      userId,
    );
    if (!response) return;

    return this.say(context, response);
  };

  messageHandler = async (context: MessengerContext) => {
    const {
      event,
      _session: {
        user: { id: userId },
      },
    } = context;
    if (event.isLocation) {
      return this.locationHandler(context);
    }

    if (this.quickReplyHandlers[event.quickReply?.payload])
      return this.quickReplyHandlers[event.quickReply.payload](context);

    const response = await this.messageService.handleMessage(event, userId);
    if (!response) return;

    return this.say(context, response);
  };

  private notificationSubscriptionHandler = async (
    context: MessengerContext,
  ) => {
    const response = await this.resolverService.handleNotificationSubscription(
      context._session.user.id,
    );

    return this.say(context, response);
  };

  postbackHandler = async (context: MessengerContext) => {
    const {
      event: {
        postback: { payload: buttonPayload },
      },
      _session: {
        user: { id: userId },
      },
    } = context;

    if (this.postbackHandlers[buttonPayload])
      return this.postbackHandlers[buttonPayload](context);

    const response = await this.postbackService.handlePostback(
      buttonPayload,
      userId,
    );
    if (!response) return;

    return this.say(context, response);
  };

  private receivedParticipationRequestsHandler = async (
    context: MessengerContext,
  ) => {
    const response = await this.resolverService.getReceivedParticipationRequestList(
      context._session.user.id,
    );

    return this.say(context, response);
  };

  say = async (context: MessengerContext, message: Message | Message[]) => {
    const {
      _session: {
        user: { id: recipientId },
      },
    } = context;
    if (typeof message === 'string') {
      return context.client.sendText(recipientId, message);
    } else if (isQuickReplyTemplate(message)) {
      return context.client.sendText(recipientId, message.text, {
        quickReplies: message.quickReplies,
      });
    } else if (isButtonTemplate(message)) {
      return context.client.sendTemplate(recipientId, {
        templateType: 'button',
        ...message,
      });
    } else if (isGenericTemplate(message)) {
      return context.client.sendGenericTemplate(recipientId, message.cards);
    } else if (Array.isArray(message)) {
      return message.reduce((promise, msg) => {
        return promise.then(() => this.say(context, msg));
      }, Promise.resolve(undefined));
    }
    this.logger.error('Invalid format for .say() message.');
  };

  private sentParticipationRequestsHandler = async (
    context: MessengerContext,
  ) => {
    const response = await this.resolverService.getSentParticipationRequestList(
      context._session.user.id,
    );

    return this.say(context, response);
  };

  private subscribeToNotificationsHandler = async (
    context: MessengerContext,
  ) => {
    const response = await this.resolverService.subscribeToNotifications(
      context._session.user.id,
    );

    return this.say(context, response);
  };

  private unsubscribeToNotificationsHandler = async (
    context: MessengerContext,
  ) => {
    const response = await this.resolverService.unsubscribeToNotifications(
      context._session.user.id,
    );

    return this.say(context, response);
  };

  private upcomingActivitiesHandler = async (context: MessengerContext) => {
    const response = await this.resolverService.getUpcomingActivities(
      context._session.user.id,
    );
    return this.say(context, response);
  };

  private updateUserLocationHandler = async (context: MessengerContext) => {
    const response = await this.resolverService.updateUserLocation(
      context._session.user.id,
    );

    return this.say(context, response);
  };

  postbackHandlers = {
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

  quickReplyHandlers = {
    [CREATED_ACTIVITIES_PAYLOAD]: this.createdActivitiesHandler,
    [INITIALIZE_ACTIVITY_PAYLOAD]: this.initializeActivityHandler,
    [JOINED_ACTIVITIES_PAYLOAD]: this.joinedActivitiesHandler,
    [UPCOMING_ACTIVITIES_PAYLOAD]: this.upcomingActivitiesHandler,
  };
}
