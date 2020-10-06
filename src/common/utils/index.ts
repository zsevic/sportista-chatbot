import { PAGE_SIZE } from 'common/config/constants';

export const formatDatetime = (datetime: string): string => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Date(datetime).toLocaleDateString('sr-Latn-RS', options);
};

export const getSkip = (page: number): number => (page - 1) * PAGE_SIZE;
