import { utcToZonedTime } from 'date-fns-tz';
import {
  DATE_LOCALES,
  DEFAULT_DATETIME_LOCALE,
  PAGE_SIZE,
} from 'common/config/constants';
import { DatetimeOptions } from 'common/types';

export const formatDatetime = (
  datetime: string,
  datetimeOptions: DatetimeOptions,
) => {
  const { lang, timezone } = datetimeOptions;
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return utcToZonedTime(datetime, timezone).toLocaleDateString(
    DATE_LOCALES[lang] || DATE_LOCALES[DEFAULT_DATETIME_LOCALE],
    options,
  );
};

export const getSkip = (page: number): number => (page - 1) * PAGE_SIZE;
