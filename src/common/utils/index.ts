import { addHours } from 'date-fns';
import {
  DATE_LOCALES,
  DEFAULT_DATETIME_LOCALE,
  PAGE_SIZE,
} from 'common/config/constants';
import { DateTimeOptions } from 'common/types';

export const formatDatetime = (
  datetime: string,
  dateTimeOptions: DateTimeOptions,
): string => {
  const { lang, timezone } = dateTimeOptions;
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const timezonedDateTime = addHours(new Date(datetime), timezone);

  return new Date(timezonedDateTime).toLocaleDateString(
    DATE_LOCALES[lang] || DATE_LOCALES[DEFAULT_DATETIME_LOCALE],
    options,
  );
};

export const getSkip = (page: number): number => (page - 1) * PAGE_SIZE;
