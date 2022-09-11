import * as trpc from "@trpc/server";
import { z } from "zod";
import { cacheWeatherData, getCacheData } from "../../cache/cache";
import { BasicWeatherData, Weather, WeatherDataResponse } from "./schemas";
import { getUnixTime } from "../../../../utils";

export async function getWeatherData(
  location: string,
  apiKey: string
): Promise<Weather | null> {
  return (
    (await getCachedWeatherData(location)) ??
    (await requestWeatherData(location, apiKey))
  );
}

async function requestWeatherData(
  location: string,
  apiKey: string
): Promise<Weather | null> {
  console.info(`Requesting weather data for: "${location}"`);
  // Get basic weather data so we have the lat/lon
  const basicWeatherData = await getBasicWeatherData(location, apiKey);
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
  apiKey: string
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
      getUnixTime() - x.timeObtained <= 3600
  );

  if (!cachedWeatherData) return null;

  return cachedWeatherData.weatherData;
}

const weatherRouter = trpc.router().query("get", {
  input: z.object({ location: z.string(), apiKey: z.string() }),
  async resolve({ input }) {
    return await getWeatherData(input.location, input.apiKey);
  },
});

export default weatherRouter;
