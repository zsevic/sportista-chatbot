export const getImageUrl = (activityType: string): string =>
  `https://loremflickr.com/460/240/${activityType}`;

export const getLocationUrl = (latitude: number, longitude: number): string =>
  `http://www.google.com/maps/place/${latitude},${longitude}`;
