"use server";

import { BasicWeatherData, Weather, WeatherDataResponse } from "./schemas";
import { cacheWeatherData, getCacheData } from "../cache/cache";
import { getUnixTime } from "@/utils/utils";

export async function getWeatherData(
  location: string,
  apiKey: string,
): Promise<Weather | null> {
  return (
    (await getCachedWeatherData(location)) ??
    (await requestWeatherData(location, apiKey))
  );
}

async function requestWeatherData(
  location: string,
  apiKey: string,
): Promise<Weather | null> {
  // Get basic weather data so we have the lat/lon
  const basicWeatherData = await getBasicWeatherData(location, apiKey);
  if (basicWeatherData === null) return null;

  // Format weather data
  const weatherData = await getDetailedWeatherData(
    basicWeatherData.coord.lat,
    basicWeatherData.coord.lon,
    apiKey,
  );

  if (weatherData) cacheWeatherData(weatherData, location);

  return weatherData;
}

export async function getDetailedWeatherData(
  lat: number,
  lon: number,
  apiKey: string,
): Promise<Weather | null> {
  const cachedWeatherData = await getCachedWeatherData(`${lat},${lon}`);
  if (cachedWeatherData) {
    console.log("Got cached weather data detailed");
    return cachedWeatherData;
  }

  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${apiKey}`;
  const weatherResponse = await fetch(url, { cache: "no-store" });
  if (weatherResponse.status !== 200) return null;

  const weatherData = weatherDataResponseToWeatherData(
    await weatherResponse.json(),
  );

  // Cache the weather data
  await cacheWeatherData(weatherData, `${lat},${lon}`);

  return weatherData;
}

function weatherDataResponseToWeatherData(
  weatherDataResponse: WeatherDataResponse,
): Weather {
  return {
    time: weatherDataResponse.current.dt,
    temperature: weatherDataResponse.current.temp,
    feelsLike: weatherDataResponse.current.feels_like,
    icon: weatherDataResponse.current.weather[0].icon,
    description: weatherDataResponse.current.weather[0].description,
    rainChance: weatherDataResponse.daily[0].pop,
  };
}

async function getBasicWeatherData(
  location: string,
  apiKey: string,
): Promise<BasicWeatherData | null> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
  const weatherResponse = await fetch(url);
  if (weatherResponse.status !== 200) return null;

  const basicWeatherdata: BasicWeatherData = await weatherResponse.json();

  return basicWeatherdata;
}

async function getCachedWeatherData(location: string): Promise<Weather | null> {
  console.info(`Getting cached weather data for: "${location}"`);
  const cacheData = await getCacheData();

  // If there is no cached weather data there's no point in searching
  const allCachedWeatherData = cacheData.cachedWeatherData;
  if (!allCachedWeatherData) return null;

  // Find the unexpired cached weather data for the location
  const cachedWeatherData = allCachedWeatherData.find(
    (x) =>
      x.location.toLowerCase().trim() == location.toLowerCase().trim() &&
      getUnixTime() - x.timeObtained <= 3600,
  );

  if (!cachedWeatherData) return null;

  return cachedWeatherData.weatherData;
}
