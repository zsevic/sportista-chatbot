import { Controller } from '@nestjs/common';
import { MessengerBotResolver } from 'modules/bots/messenger-bot/messenger-bot.resolver';
import { AttachmentService, MessageService, PostbackService } from './services';

@Controller()
export class MessengerBotController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly messageService: MessageService,
    private readonly postbackService: PostbackService,
    private readonly resolver: MessengerBotResolver,
  ) {}

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

  createdActivitiesHandler = async (payload, chat) => {
    const response = await this.resolver.getCreatedActivities(
      payload.sender.id,
    );
    return chat.say(response);
  };

  getStartedButtonHandler = async (_, chat) => {
    const {
      id,
      first_name,
      gender,
      last_name,
      profile_pic: image_url,
    } = await chat.getUserProfile();
    const response = await this.resolver.registerUser({
      id,
      first_name,
      gender,
      image_url,
      last_name,
    });

    return chat.say(response);
  };

  initializeActivityHandler = async (payload, chat) => {
    const response = await this.resolver.initializeActivity(payload.sender.id);
    return chat.say(response);
  };

  joinedActivitiesHandler = async (payload, chat) => {
    const response = await this.resolver.getJoinedActivities(payload.sender.id);
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

  postbackHandler = async (payload, chat) => {
    const {
      postback: { payload: buttonPayload },
      sender: { id: userId },
    } = payload;

    const response = await this.postbackService.handlePostback(
      buttonPayload,
      userId,
    );
    if (!response) return;

    return chat.say(response);
  };

  upcomingActivitiesHandler = async (payload, chat) => {
    const response = await this.resolver.getUpcomingActivities(
      payload.sender.id,
    );
    return chat.say(response);
  };
}
