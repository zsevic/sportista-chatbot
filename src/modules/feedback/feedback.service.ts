import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.dto';
import { FeedbackEntity } from './feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private feedbackRepository: Repository<FeedbackEntity>,
  ) {}

  createFeedback = async (feedbackDto: Feedback): Promise<Feedback> =>
    this.feedbackRepository.save(feedbackDto);
}
