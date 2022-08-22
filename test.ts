// Generated by ts-to-zod
import { z } from "zod";

export const weatherSchema = z.object({
  temperature: z.number(),
  description: z.string(),
  icon: z.string(),
  feelsLike: z.number(),
  rainChance: z.number(),
});

const basicWeatherSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const coordSchema = z.object({
  lon: z.number(),
  lat: z.number(),
});

const mainSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  temp_min: z.number(),
  temp_max: z.number(),
  pressure: z.number(),
  humidity: z.number(),
});

const windSchema = z.object({
  speed: z.number(),
  deg: z.number(),
  gust: z.number(),
});

const cloudsSchema = z.object({
  all: z.number(),
});

const sysSchema = z.object({
  type: z.number(),
  id: z.number(),
  country: z.string(),
  sunrise: z.number(),
  sunset: z.number(),
});

const currentSchema = z.object({
  dt: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number(),
  clouds: z.number(),
  visibility: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  wind_gust: z.number(),
  weather: z.array(weatherSchema),
});

const hourlyWeatherSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const rainSchema = z.object({
  "1h": z.number(),
});

const hourlySchema = z.object({
  dt: z.number(),
  temp: z.number(),
  feels_like: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  uvi: z.number(),
  clouds: z.number(),
  visibility: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  wind_gust: z.number(),
  weather: z.array(hourlyWeatherSchema),
  pop: z.number(),
  rain: rainSchema,
});

const tempSchema = z.object({
  day: z.number(),
  min: z.number(),
  max: z.number(),
  night: z.number(),
  eve: z.number(),
  morn: z.number(),
});

const feelsLikeSchema = z.object({
  day: z.number(),
  night: z.number(),
  eve: z.number(),
  morn: z.number(),
});

const dailyWeatherSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const dailySchema = z.object({
  dt: z.number(),
  sunrise: z.number(),
  sunset: z.number(),
  moonrise: z.number(),
  moonset: z.number(),
  moon_phase: z.number(),
  temp: tempSchema,
  feels_like: feelsLikeSchema,
  pressure: z.number(),
  humidity: z.number(),
  dew_point: z.number(),
  wind_speed: z.number(),
  wind_deg: z.number(),
  wind_gust: z.number(),
  weather: z.array(dailyWeatherSchema),
  clouds: z.number(),
  pop: z.number(),
  uvi: z.number(),
  rain: z.number().optional(),
});

export const weatherDataResponseSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  timezone_offset: z.number(),
  current: currentSchema,
  hourly: z.array(hourlySchema),
  daily: z.array(dailySchema),
});

export const basicWeatherDataSchema = z.object({
  coord: coordSchema,
  weather: z.array(basicWeatherSchema),
  base: z.string(),
  main: mainSchema,
  visibility: z.number(),
  wind: windSchema,
  clouds: cloudsSchema,
  dt: z.number(),
  sys: sysSchema,
  timezone: z.number(),
  id: z.number(),
  name: z.string(),
  cod: z.number(),
});
