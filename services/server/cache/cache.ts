import fs from "fs/promises";
import { getUnixTime } from "../../../utils";
import { Weather } from "../weather/types";
import Cache from "./types";

export async function getCacheData(): Promise<Cache> {
  await ensureCacheFileExists();
  return JSON.parse(await fs.readFile("./data/cache.json", "utf8"));
}

async function ensureCacheFileExists() {
  // Try getting stats for the cache file, if it errors the file doesn't exist so we need to create it
  try {
    await fs.stat("./data/cache.json");
  } catch (ex) {
    console.warn("Failed to find cache file. Generating a new one.");
    await fs.writeFile("./data/cache.json", JSON.stringify({}));
  }
}

export async function cacheWeatherData(
  newWeatherdata: Weather,
  location: string
) {
  const cacheData = await getCacheData();
  // Initialize cachedWeatherData
  if (!cacheData.cachedWeatherData) cacheData.cachedWeatherData = [];

  // Remove existing cache for the location
  cacheData.cachedWeatherData = cacheData.cachedWeatherData.filter(
    (x) => x.location.toLowerCase().trim() != location.toLowerCase().trim()
  );

  // Add new cached data for the location
  cacheData.cachedWeatherData.push({
    location,
    timeObtained: getUnixTime(),
    weatherData: newWeatherdata,
  });

  await fs.writeFile("./data/cache.json", JSON.stringify(cacheData));
}
