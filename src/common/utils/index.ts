import { utcToZonedTime } from 'date-fns-tz';
import { DEFAULT_LOCALE, LOCALES, PAGE_SIZE } from 'common/config/constants';
import { DatetimeOptions } from 'common/types';

export const formatDatetime = (
  datetime: string,
  datetimeOptions: DatetimeOptions,
) => {
  const { locale, timezone } = datetimeOptions;
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return utcToZonedTime(datetime, timezone).toLocaleDateString(
    LOCALES[locale] || LOCALES[DEFAULT_LOCALE],
    options,
  );
};

export const getSkip = (page: number): number => (page - 1) * PAGE_SIZE;

export const isEnv = (environment: string): boolean => process.env.NODE_ENV === environment;
