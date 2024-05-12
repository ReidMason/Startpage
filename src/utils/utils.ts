import { v4 as uuidv4 } from "uuid";

export function getUnixTime(): number {
  // Gets unix time in seconds
  return Math.floor(Date.now() / 1000);
}

export function roundToDecimal(value: number, decimal: number): number {
  return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
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

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
