import { z } from "zod";
import { weatherSchema } from "../weather/schemas";
import { ipInfoSchema } from "../ipInfo/schema";

export type WeatherDataCache = z.infer<typeof cachedWeatherDataSchema>;
export type Cache = z.infer<typeof cacheSchema>;

const cachedWeatherDataSchema = z.object({
  timeObtained: z.number(),
  location: z.string(),
  weatherData: weatherSchema,
});

const ipInfoCacheSchema = z.record(
  z.string(),
  z.object({
    timeObtained: z.number(),
    data: ipInfoSchema,
  }),
);

export const cacheSchema = z.object({
  cachedWeatherData: z.array(cachedWeatherDataSchema).default([]),
  ipInfo: ipInfoCacheSchema.default({}),
});
