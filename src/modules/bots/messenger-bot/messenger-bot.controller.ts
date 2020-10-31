import { Controller } from '@nestjs/common';
import {
  ABOUT_ME_PAYLOAD,
  CREATED_ACTIVITIES_PAYLOAD,
  GET_STARTED_PAYLOAD,
  INITIALIZE_ACTIVITY_PAYLOAD,
  INITIALIZE_FEEDBACK_PAYLOAD,
  JOINED_ACTIVITIES_PAYLOAD,
  NOTIFICATION_SUBSCRIPTION_PAYLOAD,
  SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  UPCOMING_ACTIVITIES_PAYLOAD,
  UPDATE_USER_LOCATION_PAYLOAD,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { AttachmentService } from './services/attachment.service';
import { MessageService } from './services/message.service';
import { PostbackService } from './services/postback.service';
import { ResolverService } from './services/resolver.service';

@Controller()
export class MessengerBotController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly messageService: MessageService,
    private readonly postbackService: PostbackService,
    private readonly resolverService: ResolverService,
  ) {}

  private aboutMeHandler = async (payload, chat) => {
    const response = await this.resolverService.getAboutMeResponse(
      payload.sender.id,
    );

    return chat.say(response);
  };

  attachmentHandler = async (payload, chat) => {
    const {
      message,
      sender: { id: userId },
    } = payload;

    const response = await this.attachmentService.handleAttachment(
      message,
      userId,
    );
    if (!response) return;

    return chat.say(response);
  };

  private createdActivitiesHandler = async (payload, chat) => {
    const response = await this.resolverService.getCreatedActivities(
      payload.sender.id,
    );
    return chat.say(response);
  };

  private getStartedButtonHandler = async (_, chat) => {
    const {
      id,
      first_name,
      gender,
      last_name,
      locale,
      profile_pic: image_url,
    } = await chat.getUserProfile();
    const response = await this.resolverService.registerUser({
      id,
      first_name,
      gender,
      image_url,
      last_name,
      locale,
    });

    return chat.say(response);
  };

  private initializeActivityHandler = async (payload, chat) => {
    const response = await this.resolverService.initializeActivity(
      payload.sender.id,
    );
    return chat.say(response);
  };

  private initializeFeedbackHandler = async (payload, chat) => {
    const response = await this.resolverService.initializeFeedback(
      payload.sender.id,
    );
    return chat.say(response);
  };

  private joinedActivitiesHandler = async (payload, chat) => {
    const response = await this.resolverService.getJoinedActivities(
      payload.sender.id,
    );
    return chat.say(response);
  };

  messageHandler = async (payload, chat) => {
    const {
      message,
      sender: { id: userId },
    } = payload;

    if (this.quickReplyHandlers[message.quick_reply?.payload])
      return this.quickReplyHandlers[message.quick_reply.payload](
        payload,
        chat,
      );

    const response = await this.messageService.handleMessage(message, userId);
    if (!response) return;

    return chat.say(response);
  };

  private notificationSubscriptionHandler = async (payload, chat) => {
    const response = await this.resolverService.handleNotificationSubscription(
      payload.sender.id,
    );

    return chat.say(response);
  };

  postbackHandler = async (payload, chat) => {
    const {
      postback: { payload: buttonPayload },
      sender: { id: userId },
    } = payload;

    if (this.postbackHandlers[buttonPayload])
      return this.postbackHandlers[buttonPayload](payload, chat);

    const response = await this.postbackService.handlePostback(
      buttonPayload,
      userId,
    );
    if (!response) return;

    return chat.say(response);
  };

  private subscribeToNotificationsHandler = async (payload, chat) => {
    const response = await this.resolverService.subscribeToNotifications(
      payload.sender.id,
    );

    return chat.say(response);
  };

  private unsubscribeToNotificationsHandler = async (payload, chat) => {
    const response = await this.resolverService.unsubscribeToNotifications(
      payload.sender.id,
    );

    return chat.say(response);
  };

  private upcomingActivitiesHandler = async (payload, chat) => {
    const response = await this.resolverService.getUpcomingActivities(
      payload.sender.id,
    );
    return chat.say(response);
  };

  private updateUserLocationHandler = async (payload, chat) => {
    const response = await this.resolverService.updateUserLocation(
      payload.sender.id,
    );

    return chat.say(response);
  };

  postbackHandlers = {
    [ABOUT_ME_PAYLOAD]: this.aboutMeHandler,
    [CREATED_ACTIVITIES_PAYLOAD]: this.createdActivitiesHandler,
    [GET_STARTED_PAYLOAD]: this.getStartedButtonHandler,
    [INITIALIZE_ACTIVITY_PAYLOAD]: this.initializeActivityHandler,
    [INITIALIZE_FEEDBACK_PAYLOAD]: this.initializeFeedbackHandler,
    [JOINED_ACTIVITIES_PAYLOAD]: this.joinedActivitiesHandler,
    [NOTIFICATION_SUBSCRIPTION_PAYLOAD]: this.notificationSubscriptionHandler,
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
