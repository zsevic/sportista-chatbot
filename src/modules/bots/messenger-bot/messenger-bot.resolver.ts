import { Injectable } from '@nestjs/common';
import { Activity } from 'modules/activity/activity.dto';
import { ActivityService } from 'modules/activity/activity.service';
import { FIRST_PAGE } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { ParticipationService } from 'modules/participation/participation.service';
import { State } from 'modules/state/state.dto';
import { StateService } from 'modules/state/state.service';
import { User } from 'modules/user/user.dto';
import { UserService } from 'modules/user/user.service';
import { MessengerBotResponses } from './messenger-bot.responses';
import {
  CANCEL_ACTIVITY_FAILURE_TEXT,
  CANCEL_ACTIVITY_SUCCESS_TEXT,
  CANCEL_PARTICIPATION_FAILURE_TEXT,
  CANCEL_PARTICIPATION_SUCCESS_TEXT,
  JOIN_ACTIVITY_FAILURE_TEXT,
  JOIN_ACTIVITY_SUCCESS_TEXT,
  NOTIFY_ORGANIZER_TEXT,
  NOTIFY_PARTICIPANTS_TEXT,
  REGISTRATION_FAILURE_TEXT,
  REGISTRATION_SUCCESS_TEXT,
  RESET_REMAINING_VACANCIES_TEXT,
  UPDATE_REMAINING_VACANCIES_FAILURE_TEXT,
} from './messenger-bot.texts';

@Injectable()
export class MessengerBotResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly responses: MessengerBotResponses,
    private readonly participationService: ParticipationService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
  ) {}

  addRemainingVacancies = async (activityId: string, organizerId: number) => {
    try {
      const updatedActivity = await this.activityService.addRemainingVacancies(
        activityId,
        organizerId,
      );
      return this.responses.getUpdatedRemainingVacanciesResponse(
        updatedActivity,
      );
    } catch {
      return UPDATE_REMAINING_VACANCIES_FAILURE_TEXT;
    }
  };

  cancelActivity = async (
    activityId: string,
    organizerId: number,
  ): Promise<string | string[]> => {
    try {
      await this.activityService.cancelActivity(activityId, organizerId);
      return [CANCEL_ACTIVITY_SUCCESS_TEXT, NOTIFY_PARTICIPANTS_TEXT];
    } catch {
      return CANCEL_ACTIVITY_FAILURE_TEXT;
    }
  };

  cancelParticipation = async (
    activityId: string,
    userId: number,
  ): Promise<string | string[]> => {
    try {
      await this.participationService.cancelParticipation(activityId, userId);
      return [CANCEL_PARTICIPATION_SUCCESS_TEXT, NOTIFY_ORGANIZER_TEXT];
    } catch {
      return CANCEL_PARTICIPATION_FAILURE_TEXT;
    }
  };

  createActivity = async (newActivity: Activity) => {
    await this.activityService.createActivity(newActivity);

    return this.responses.messages[this.stateService.states.closing];
  };

  getCreatedActivities = async (userId: number, page = FIRST_PAGE) => {
    const activityListData = await this.activityService.getCreatedActivities(
      userId,
    );

    return this.responses.getCreatedActivitiesResponse({
      ...activityListData,
      page,
    });
  };

  getCurrentState = async (userId: number): Promise<State> =>
    this.stateService.getCurrentState(userId);

  getJoinedActivities = async (userId: number, page = FIRST_PAGE) => {
    const activityListData = await this.activityService.getJoinedActivities(
      userId,
      page,
    );

    return this.responses.getJoinedActivitiesResponse({
      ...activityListData,
      page,
    });
  };

  getOrganizer = async (id: number) => {
    const organizer = await this.userService.getOrganizer(id);

    return this.responses.getOrganizerResponse(organizer);
  };

  getParticipantList = async (id: string) => {
    const participantList = await this.userService.getParticipantList(id);

    return this.responses.getParticipantListResponse(participantList);
  };

  getUpcomingActivities = async (userId: number, page = FIRST_PAGE) => {
    const activityListData = await this.activityService.getUpcomingActivities(
      userId,
    );

    return this.responses.getUpcomingActivitiesResponse({
      ...activityListData,
      page,
    });
  };

  initializeActivity = async (userId: number) => {
    const initialState = {
      current_state: this.stateService.states.type,
    };
    await this.stateService.updateState(userId, initialState);

    return this.responses.getInitializeActivityResponse();
  };

  joinActivity = async (
    activityId: string,
    userId: number,
  ): Promise<string | string[]> => {
    try {
      await this.activityService.joinActivity(activityId, userId);
      return [JOIN_ACTIVITY_SUCCESS_TEXT, NOTIFY_ORGANIZER_TEXT];
    } catch {
      return JOIN_ACTIVITY_FAILURE_TEXT;
    }
  };

  registerUser = async (userDto: User): Promise<string> => {
    try {
      await this.userService.registerUser(userDto);
      return REGISTRATION_SUCCESS_TEXT;
    } catch {
      return REGISTRATION_FAILURE_TEXT;
    }
  };

  resetRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ): Promise<string> => {
    try {
      await this.activityService.resetRemainingVacancies(
        activityId,
        organizerId,
      );
      return RESET_REMAINING_VACANCIES_TEXT;
    } catch {
      return UPDATE_REMAINING_VACANCIES_FAILURE_TEXT;
    }
  };

  resetState = async (userId: number): Promise<State> =>
    this.stateService.resetState(userId);

  subtractRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ) => {
    try {
      const updatedActivity = await this.activityService.subtractRemainingVacancies(
        activityId,
        organizerId,
      );

      return this.responses.getUpdatedRemainingVacanciesResponse(
        updatedActivity,
      );
    } catch {
      return UPDATE_REMAINING_VACANCIES_FAILURE_TEXT;
    }
  };

  updateState = async (userId: number, updatedState: State) => {
    await this.stateService.updateState(userId, updatedState);

    return this.responses.messages[updatedState.current_state];
  };
}
