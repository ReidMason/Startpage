import { v4 as uuidv4 } from "uuid";

export function getUnixTime(): number {
  // Gets unix time in seconds
  return Math.floor(Date.now() / 1000);
}

export function generateUuid(): string {
  return uuidv4();
}

export function isValidUrl(text: string) {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
