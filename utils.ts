import { v4 as uuidv4 } from "uuid";
import { Config } from "./src/backend/routers/config/schemas";

export function getUnixTime(): number {
  // Gets unix time in seconds
  return Math.floor(Date.now() / 1000);
}

export function generateUuid(): string {
  return uuidv4();
}

export function isNumeric(text: string) {
  // Tests if a string is numeric
  return /^\d+$/.test(text);
}

export function getHost(): string {
  const host = process.env.HOST ?? "";
  return host.endsWith("/") ? host.slice(0, -1) : host;
}

export const updateGlobalClasses = (config: Config) => {
  if (config.appearance.appearance === "system") {
    const useDarkmode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (useDarkmode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  } else if (config.appearance.appearance === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  if (config.appearance.glassy) document.body.classList.add("glassy");
  else document.body.classList.remove("glassy");
};

export const getGlobalClasses = (config?: Config): string => {
  if (!config) return "";

  var globalClasses = "";

  if (config.appearance.appearance === "system") {
    const useDarkmode = true;
    if (useDarkmode) globalClasses += "dark";
  } else if (config.appearance.appearance === "dark") {
    globalClasses += "dark";
  }

  if (config.appearance.glassy) globalClasses += " glassy";

  return globalClasses;
};
