export const states = {
  activity_datetime: 'activity_datetime',
  activity_location: 'activity_location',
  activity_price: 'activity_price',
  activity_remaining_vacancies: 'activity_remaining_vacancies',
  activity_type: 'activity_type',
  create_activity_closing: 'create_activity_closing',
  get_upcoming_activities: 'get_upcoming_activities',
  initialize_activity: 'initialize_activity',
  initialize_feedback: 'initialize_feedback',
  subscribe_to_notifications: 'subscribe_to_notifications',
  unsubscribe_to_notifications: 'unsubscribe_to_notifications',
};

export const notificationSubscriptionStates = [
  states.subscribe_to_notifications,
  states.unsubscribe_to_notifications,
];

export const nextStates = {
  [states.activity_type]: states.activity_datetime,
  [states.activity_datetime]: states.activity_location,
  [states.activity_location]: states.activity_price,
  [states.activity_price]: states.activity_remaining_vacancies,
  [states.activity_remaining_vacancies]: states.create_activity_closing,
};
