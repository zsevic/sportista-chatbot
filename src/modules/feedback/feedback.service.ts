import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { StateRepository } from 'modules/state/state.repository';
import { Feedback } from './feedback.dto';
import { FeedbackEntity } from './feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private feedbackRepository: Repository<FeedbackEntity>,
    private readonly stateRepository: StateRepository,
  ) {}

  @Transactional()
  async createFeedback(feedbackDto: Feedback): Promise<void> {
    await this.feedbackRepository.save(feedbackDto);
    await this.stateRepository.resetState(feedbackDto.user_id);
  }
}
