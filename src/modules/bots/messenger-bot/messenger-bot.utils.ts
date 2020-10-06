import { formatDatetime } from 'common/utils';
import { ACTIVITY_TYPES } from 'modules/activity/activity.constants';
import { Activity } from 'modules/activity/activity.dto';
import { User } from 'modules/user/user.dto';
import {
  ADD_REMAINING_VACANCIES_TYPE,
  ORGANIZER_TYPE,
  PAGE_SIZE,
  RESET_REMAINING_VACANCIES_TYPE,
  SUBTRACT_REMAINING_VACANCIES_TYPE,
} from './messenger-bot.constants';
import {
  ADD_REMAINING_VACANCIES_TEXT,
  LOCATION_TEXT,
  NO_REMAINING_VACANCIES_TEXT,
  ORGANIZER_TEXT,
  REMAINING_VACANCIES_TEXT,
  SUBTRACT_REMAINING_VACANCIES_TEXT,
  VIEW_MORE_TEXT,
} from './messenger-bot.texts';

const getLocationUrl = (latitude: number, longitude: number): string =>
  `http://www.google.com/maps/place/${latitude},${longitude}`;

const getElementFromActivity = (
  activity: Activity,
  buttonTitle: string,
  buttonPayload: string,
  isOrganizerShown = true,
) => {
  const title = `${
    activity.remaining_vacancies > 0
      ? `${REMAINING_VACANCIES_TEXT} ${activity.remaining_vacancies}`
      : NO_REMAINING_VACANCIES_TEXT
  } za ${activity.type}`;
  const url = getLocationUrl(
    activity.location_latitude,
    activity.location_longitude,
  );

  const buttons = [
    { type: 'postback', title: buttonTitle, payload: buttonPayload },
    { type: 'web_url', title: LOCATION_TEXT, url },
  ];
  if (isOrganizerShown) {
    buttons.push({
      type: 'postback',
      title: ORGANIZER_TEXT,
      payload: `type=${ORGANIZER_TYPE}&user_id=${activity.organizer_id}`,
    });
  }
  const datetime = formatDatetime(activity.datetime);

  return {
    title,
    subtitle: `${datetime}, ${activity.location_title}, ${activity.price} RSD`,
    ...(ACTIVITY_TYPES[activity.type] && {
      image_url: `https://loremflickr.com/320/240/${
        ACTIVITY_TYPES[activity.type]
      }`,
    }),
    buttons,
  };
};

export const getElementFromUser = (user: User) => ({
  title: `${user.first_name} ${user.last_name}`,
  image_url: user.image_url,
});

export const getActivitiesResponse = ({
  activityListData,
  activityTypeText,
  activityType,
  noActivitiesText,
  viewMoreActivitiesText,
  buttonPayloadActivityType,
  isOrganizerShown,
}) => {
  const { results, page, total } = activityListData;

  if (results.length === 0) return noActivitiesText;

  const elements = results.map((activity: Activity) =>
    getElementFromActivity(
      activity,
      activityTypeText,
      `type=${activityType}&activity_id=${activity.id}`,
      isOrganizerShown,
    ),
  );

  const hasNextPage = PAGE_SIZE * page < total;
  const nextPage = page + 1;

  const response: any = [{ cards: elements }];

  if (hasNextPage) {
    response.push({
      text: viewMoreActivitiesText,
      buttons: [
        {
          type: 'postback',
          title: VIEW_MORE_TEXT,
          payload: `type=${buttonPayloadActivityType}&page=${nextPage}`,
        },
      ],
    });
  }

  return response;
};

export const getRemainingVacanciesButtons = (activityId: string) => [
  {
    type: 'postback',
    title: ADD_REMAINING_VACANCIES_TEXT,
    payload: `type=${ADD_REMAINING_VACANCIES_TYPE}&activity_id=${activityId}`,
  },
  {
    type: 'postback',
    title: SUBTRACT_REMAINING_VACANCIES_TEXT,
    payload: `type=${SUBTRACT_REMAINING_VACANCIES_TYPE}&activity_id=${activityId}`,
  },
  {
    type: 'postback',
    title: NO_REMAINING_VACANCIES_TEXT,
    payload: `type=${RESET_REMAINING_VACANCIES_TYPE}&activity_id=${activityId}`,
  },
];
