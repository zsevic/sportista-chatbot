import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateRepository } from './state.repository';
import { StateService } from './state.service';

@Module({
  imports: [TypeOrmModule.forFeature([StateRepository])],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
