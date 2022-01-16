import { BasicWeatherData } from "../../../interfaces/BasicWeatherDataResponse";
import { WeatherDataResponse } from "../../../interfaces/WeatherDataResponse";
import WeatherData from "../../../interfaces/WeatherData";
import { getConfig } from "../../../services/config";
import { getUnixTime } from "../../../utils";
import { cacheWeatherData, getCacheData } from '../../../services/cache';
import { NextApiRequest, NextApiResponse } from "next";


export default async function getweather(req: NextApiRequest, res: NextApiResponse) {
    const config = await getConfig();
    var weatherData = await getCachedWeatherData(config.weather.location);

    // If weather data is not found in cache request new data and cache it
    if (weatherData === null) {
        weatherData = await getWeatherData();
        cacheWeatherData(weatherData, config.weather.location);
    }

    res.status(200).json(weatherData);
}

async function getWeatherData(): Promise<WeatherData> {
    const config = await getConfig();
    // Get basic weather data so we have the lat/lon
    const basicWeatherData = await getBasicWeatherData(config.weather.location);

    // Request weather data
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${basicWeatherData.coord.lat}&lon=${basicWeatherData.coord.lon}&exclude=minutely&units=metric&appid=${config.weather.apiKey}`
    const weatherResponse = await fetch(url);
    const rawWeatherData: WeatherDataResponse = await weatherResponse.json();

    // Format weather data
    return {
        temperature: rawWeatherData.current.temp,
        feelsLike: rawWeatherData.current.feels_like,
        icon: rawWeatherData.current.weather[0].icon,
        description: rawWeatherData.current.weather[0].description,
        rainChance: rawWeatherData.daily[0].pop
    }
}

async function getBasicWeatherData(location: string): Promise<BasicWeatherData> {
    const config = await getConfig();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${config.weather.apiKey}`;
    const weatherResponse = await fetch(url);
    const basicWeatherdata = await weatherResponse.json();

    return basicWeatherdata;
}

async function getCachedWeatherData(location: string): Promise<WeatherData | null> {
    const cacheData = await getCacheData();

    // If there is no cached weather data there's no point in searching
    const allCachedWeatherData = cacheData.cachedWeatherData;
    if (!allCachedWeatherData)
        return null;

    // Find the unexpired cached weather data for the location
    const cachedWeatherData = allCachedWeatherData.find(x => x.location.toLowerCase().trim() == location.toLowerCase().trim() && (getUnixTime() - x.timeObtained) <= 3600);

    if (!cachedWeatherData)
        return null;

    return cachedWeatherData.weatherData;
}


