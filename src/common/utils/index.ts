import {
  DATE_LOCALES,
  DEFAULT_DATETIME_LOCALE,
  PAGE_SIZE,
} from 'common/config/constants';

export const formatDatetime = (datetime: string, lang: string): string => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Date(datetime).toLocaleDateString(
    DATE_LOCALES[lang] || DATE_LOCALES[DEFAULT_DATETIME_LOCALE],
    options,
  );
};

export const getSkip = (page: number): number => (page - 1) * PAGE_SIZE;
