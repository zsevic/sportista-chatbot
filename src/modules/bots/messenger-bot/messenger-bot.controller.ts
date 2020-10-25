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

    switch (buttonPayload) {
      case ABOUT_ME_PAYLOAD:
        return this.aboutMeHandler(payload, chat);
      case CREATED_ACTIVITIES_PAYLOAD:
        return this.createdActivitiesHandler(payload, chat);
      case GET_STARTED_PAYLOAD:
        return this.getStartedButtonHandler(payload, chat);
      case INITIALIZE_ACTIVITY_PAYLOAD:
        return this.initializeActivityHandler(payload, chat);
      case INITIALIZE_FEEDBACK_PAYLOAD:
        return this.initializeFeedbackHandler(payload, chat);
      case JOINED_ACTIVITIES_PAYLOAD:
        return this.joinedActivitiesHandler(payload, chat);
      case NOTIFICATION_SUBSCRIPTION_PAYLOAD:
        return this.notificationSubscriptionHandler(payload, chat);
      case SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD:
        return this.subscribeToNotificationsHandler(payload, chat);
      case UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD:
        return this.unsubscribeToNotificationsHandler(payload, chat);
      case UPCOMING_ACTIVITIES_PAYLOAD:
        return this.upcomingActivitiesHandler(payload, chat);
      default:
    }

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
}
