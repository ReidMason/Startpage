import { getUnixTime } from "@/utils/utils";
import { Weather } from "../weather/schemas";
import { type Cache, cacheSchema } from "./types";
import fs from "fs/promises";
import { IpInfo } from "../ipInfo/schema";
import { merge } from "lodash-es";

const CACHE_PATH = "./data/cache.json";
const WEATHER_CACHE_DURATION = 3600;
const defaultCache = cacheSchema.parse({});

export async function getCacheData(): Promise<Cache> {
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

export async function cacheWeatherData(
  newWeatherdata: Weather,
  location: string,
) {
  const cacheData = await getCacheData();
  // Initialize cachedWeatherData
  if (!cacheData.cachedWeatherData) cacheData.cachedWeatherData = [];

  // Remove existing cache for the location
  cacheData.cachedWeatherData = cacheData.cachedWeatherData.filter(
    (x) => x.location.toLowerCase().trim() != location.toLowerCase().trim(),
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

export async function cacheIpInfo(ip: string, data: IpInfo) {
  const cacheData = await getCacheData();
  if (!cacheData.ipInfo) cacheData.ipInfo = {};

  cacheData.ipInfo[ip] = {
    timeObtained: getUnixTime(),
    data,
  };

  saveCacheData(cacheData);
}
