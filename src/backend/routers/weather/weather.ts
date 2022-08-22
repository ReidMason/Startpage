import * as trpc from "@trpc/server";
import { z } from "zod";
import { cacheWeatherData, getCacheData } from "../../cache/cache";
import { BasicWeatherData, Weather, WeatherDataResponse } from "./types";
import { getUnixTime } from "../../../../utils";
import { getConfig } from "../config/config";

async function getWeatherData(
  location: string,
  apiKey?: string
): Promise<Weather | null> {
  return (
    (await getCachedWeatherData(location)) ??
    (await requestWeatherData(location, apiKey))
  );
}

async function requestWeatherData(
  location: string,
  apiKey?: string
): Promise<Weather | null> {
  if (!apiKey) apiKey = await (await getConfig()).weather.apiKey;

  console.info(`Requesting weather data for: "${location}"`);
  // Get basic weather data so we have the lat/lon
  const basicWeatherData = await getBasicWeatherData(location);
  if (basicWeatherData === null) return null;

  // Request weather data
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${basicWeatherData.coord.lat}&lon=${basicWeatherData.coord.lon}&exclude=minutely&units=metric&appid=${apiKey}`;
  const weatherResponse = await fetch(url);
  if (weatherResponse.status !== 200) return null;

  const weatherData = weatherDataResponseToWeatherData(
    await weatherResponse.json()
  );

  // Cache the weather data
  await cacheWeatherData(weatherData, location);

  // Format weather data
  return weatherData;
}

function weatherDataResponseToWeatherData(
  weatherDataResponse: WeatherDataResponse
): Weather {
  return {
    temperature: weatherDataResponse.current.temp,
    feelsLike: weatherDataResponse.current.feels_like,
    icon: weatherDataResponse.current.weather[0].icon,
    description: weatherDataResponse.current.weather[0].description,
    rainChance: weatherDataResponse.daily[0].pop,
  };
}

async function getBasicWeatherData(
  location: string,
  apiKey?: string
): Promise<BasicWeatherData | null> {
  if (!apiKey) apiKey = await (await getConfig()).weather.apiKey;

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
      getUnixTime() - x.timeObtained <= 3600
  );

  if (!cachedWeatherData) return null;

  return cachedWeatherData.weatherData;
}

const weatherRouter = trpc.router().query("get", {
  input: z.object({ location: z.string().optional() }),
  async resolve({ input }) {
    console.log(input);
    if (!input.location) {
      const config = await getConfig();
      return await getWeatherData(
        config.weather.location,
        config.weather.apiKey
      );
    }

    return await getWeatherData(input.location);
  },
});

export default weatherRouter;
