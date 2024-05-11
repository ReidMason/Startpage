import { getUnixTime } from "@/utils/utils";
import {
  WeatherDataResponse,
  weatherDataResponseSchema,
} from "../weather/schemas";
import { type Cache, cacheSchema } from "./types";
import fs from "fs/promises";
import { merge } from "lodash-es";

const CACHE_PATH = "./data/cache.json";
const WEATHER_CACHE_DURATION = 3600;
const defaultCache = cacheSchema.parse({});

async function getCacheData(): Promise<Cache> {
  await ensureCacheFileExists();
  const cache = JSON.parse(await fs.readFile("./data/cache.json", "utf8"));

  return validateCache(cache);
}

function validateCache(cache: Cache): Cache {
  const newCache = merge(defaultCache, cache);
  if (JSON.stringify(cache) != JSON.stringify(newCache))
    saveCacheData(newCache);

  return newCache;
}

async function ensureCacheFileExists() {
  // Try getting stats for the cache file, if it errors the file doesn't exist so we need to create it
  try {
    await fs.stat(CACHE_PATH);
  } catch (ex) {
    console.warn("Failed to find cache file. Generating a new one.");
    await fs.writeFile(CACHE_PATH, JSON.stringify({}));
  }
}

const saveCacheData = (cacheData: Cache) => {
  cacheData = pruneCachedWeatherData(cacheData);
  fs.writeFile(CACHE_PATH, JSON.stringify(cacheData));
};

export function formatWeatherCacheName(latitude: number, longitude: number) {
  return `${latitude},${longitude}`.toLowerCase().trim();
}

export async function cacheWeatherData(
  latitude: number,
  longitude: number,
  newWeatherdata: WeatherDataResponse,
) {
  const cacheData = await getCacheData();
  // Initialize cachedWeatherData
  if (!cacheData.cachedWeatherData) cacheData.cachedWeatherData = [];

  const location = formatWeatherCacheName(latitude, longitude);

  // Remove existing cache for the location and expired cache
  cacheData.cachedWeatherData = cacheData.cachedWeatherData.filter(
    (x) => x.location.toLowerCase().trim() != location,
  );

  // Add new cached data for the location
  cacheData.cachedWeatherData.push({
    location,
    timeObtained: getUnixTime(),
    weatherData: newWeatherdata,
  });

  saveCacheData(cacheData);
}

function pruneCachedWeatherData(cacheData: Cache): Cache {
  const currentTime = getUnixTime();
  cacheData.cachedWeatherData = cacheData.cachedWeatherData.filter(
    (x) => currentTime - x.timeObtained <= WEATHER_CACHE_DURATION,
  );

  return cacheData;
}

export async function getCachedWeatherData(
  lat: number,
  lon: number,
): Promise<WeatherDataResponse | null> {
  const location = formatWeatherCacheName(lat, lon);
  console.info(`Getting cached weather data for: "${location}"`);
  const cacheData = await getCacheData();

  // If there is no cached weather data there's no point in searching
  const allCachedWeatherData = cacheData.cachedWeatherData;
  if (!allCachedWeatherData) {
    console.warn("No cached weather data found");
    return null;
  }

  // Find the unexpired cached weather data for the location
  const cachedWeatherData = allCachedWeatherData.find(
    (x) =>
      x.location.toLowerCase().trim() == location &&
      getUnixTime() - x.timeObtained <= WEATHER_CACHE_DURATION,
  );

  if (!cachedWeatherData) {
    console.warn("No cached weather data found for the location");
    return null;
  }

  const result = weatherDataResponseSchema.safeParse(
    cachedWeatherData.weatherData,
  );
  if (!result.success) {
    console.warn("Failed to parse cached weather data", result.error);
    return null;
  }

  return result.data;
}
