import { z } from "zod";
import { weatherDataResponseSchema } from "../weather/schemas";

export type WeatherDataCache = z.infer<typeof cachedWeatherDataSchema>;
export type Cache = z.infer<typeof cacheSchema>;

const cachedWeatherDataSchema = z.object({
  timeObtained: z.number(),
  location: z.string(),
  weatherData: weatherDataResponseSchema,
});

export const cacheSchema = z.object({
  cachedWeatherData: z.array(cachedWeatherDataSchema).default([]),
});
