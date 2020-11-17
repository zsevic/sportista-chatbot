import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotUserService } from 'modules/bot-user/user.service';
import { BotUserOptions } from 'modules/bot-user/user.types';
import { Feedback } from './feedback.dto';
import { FeedbackEntity } from './feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private feedbackRepository: Repository<FeedbackEntity>,
    private readonly userService: BotUserService,
  ) {}

  createFeedback = async (
    text: string,
    userOptions: BotUserOptions,
  ): Promise<Feedback> => {
    const { id } = await this.userService.getUser(userOptions);
    const feedback = {
      user_id: id,
      text,
    };
    return this.feedbackRepository.save(feedback);
  };
}
