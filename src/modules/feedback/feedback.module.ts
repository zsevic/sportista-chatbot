import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotUserModule } from 'modules/bot-user/user.module';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity]), BotUserModule],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
