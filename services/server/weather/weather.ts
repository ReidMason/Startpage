import { getUnixTime } from "../../../utils";
import { cacheWeatherData, getCacheData } from "../cache/cache";
import { WeatherConfig } from "../config/types";
import { BasicWeatherData, Weather, WeatherDataResponse } from "./types";

export async function getWeatherData(
  weatherConfig: WeatherConfig
): Promise<Weather | null> {
  return (
    (await getCachedWeatherData(weatherConfig.location)) ??
    (await requestWeatherData(weatherConfig))
  );
}

async function requestWeatherData(
  weatherConfig: WeatherConfig
): Promise<Weather | null> {
  console.info(`Requesting weather data for: "${weatherConfig.location}"`);
  // Get basic weather data so we have the lat/lon
  const basicWeatherData = await getBasicWeatherData(weatherConfig);
  if (basicWeatherData === null) return null;

  // Request weather data
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${basicWeatherData.coord.lat}&lon=${basicWeatherData.coord.lon}&exclude=minutely&units=metric&appid=${weatherConfig.apiKey}`;
  const weatherResponse = await fetch(url);
  if (weatherResponse.status !== 200) return null;

  const weatherData = weatherDataResponseToWeatherData(
    await weatherResponse.json()
  );

  // Cache the weather data
  await cacheWeatherData(weatherData, weatherConfig.location);

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
  weatherConfig: WeatherConfig
): Promise<BasicWeatherData | null> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${weatherConfig.location}&units=metric&appid=${weatherConfig.apiKey}`;
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
