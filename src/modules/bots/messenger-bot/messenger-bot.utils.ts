export const getLocationUrl = (latitude: number, longitude: number): string =>
  `http://www.google.com/maps/place/${latitude},${longitude}`;
