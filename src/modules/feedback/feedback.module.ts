import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateRepository } from 'modules/state/state.repository';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity, StateRepository])],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
