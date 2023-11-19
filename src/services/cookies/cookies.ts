import Cookies from "js-cookie";

const LOCATION_KEY = "location";

export interface Location {
  latitude: number;
  longitude: number;
}

export function getLocation(): Location | null {
  const location = Cookies.get(LOCATION_KEY);
  if (!location) return null;

  return JSON.parse(location);
}

export function setLocation(location: Location) {
  Cookies.set(LOCATION_KEY, JSON.stringify(location));
}
