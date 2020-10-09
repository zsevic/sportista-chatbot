import { Controller } from '@nestjs/common';
import {
  AttachmentService,
  MessageService,
  ResolverService,
  PostbackService,
} from './services';

@Controller()
export class MessengerBotController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly messageService: MessageService,
    private readonly postbackService: PostbackService,
    private readonly resolverService: ResolverService,
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
    const response = await this.resolverService.getCreatedActivities(
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
    const response = await this.resolverService.registerUser({
      id,
      first_name,
      gender,
      image_url,
      last_name,
    });

    return chat.say(response);
  };

  initializeActivityHandler = async (payload, chat) => {
    const response = await this.resolverService.initializeActivity(
      payload.sender.id,
    );
    return chat.say(response);
  };

  joinedActivitiesHandler = async (payload, chat) => {
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
    const response = await this.resolverService.getUpcomingActivities(
      payload.sender.id,
    );
    return chat.say(response);
  };
}
