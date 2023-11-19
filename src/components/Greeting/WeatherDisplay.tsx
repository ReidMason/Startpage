"use client";

import { Config } from "@/services/config/schemas";
import {
  getDetailedWeatherData,
  getWeatherData,
} from "@/services/weather/weather";
import Image from "next/image";
import Icon from "../Icon/Icon";
import { useEffect, useState } from "react";
import { Weather } from "@/services/weather/schemas";
import { getLocation, setLocation } from "@/services/cookies/cookies";

interface WeatherDisplayProps {
  config: Config;
}

export default function WeatherDisplay({ config }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<Weather | null>(null);

  const showPosition = async (position: GeolocationPosition) => {
    console.log("got weather");
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    updateWeather(position.coords.latitude, position.coords.longitude);
  };

  const updateWeather = async (lat: number, lon: number) => {
    const weatherData = await getDetailedWeatherData(
      lat,
      lon,
      config.weather.apiKey,
    );

    setWeather(weatherData);
  };

  const updateWeatherFromLocation = async () => {
    const weatherData = await getWeatherData(
      config.weather.location,
      config.weather.apiKey,
    );
    setWeather(weatherData);
  };

  useEffect(() => {
    if (config.weather.location) {
      updateWeatherFromLocation();
      return;
    }

    const location = getLocation();
    if (location) updateWeather(location.latitude, location.longitude);
    navigator.geolocation.getCurrentPosition(showPosition);
  }, []);

  return (
    <div className="text-primary-100">
      {!!weather ? (
        <div className="flex">
          <Image
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather"
            width={100}
            height={100}
          />

          <div className="flex flex-col justify-center">
            <p className="mb-2 hidden capitalize md:block">
              {weather.description}
            </p>
            <div className="flex items-center justify-between gap-4 md:items-end">
              <p className="text-4xl">{Math.round(weather.temperature)}°C</p>
              {config.weather.detailed && (
                <div className="mb-1 flex items-center gap-1 text-lg">
                  <Icon icon="bi:cloud-rain-heavy-fill" />
                  <span>{Math.round(weather.rainChance * 100)}%</span>
                </div>
              )}
            </div>

            {config.weather.detailed && (
              <div className="flex flex-col text-lg">
                <span>Feels Like {Math.round(weather.feelsLike)}°C</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-[100px] animate-pulse space-x-4">
          <div className="flex h-full items-center">
            <div className="h-16 w-16 rounded-full bg-primary-200 dark:bg-primary-700/40" />
          </div>
          <div className="flex w-36 flex-col gap-2">
            <div className="h-6 rounded-xl bg-primary-200 dark:bg-primary-700/40" />
            <div className="h-16 rounded-xl bg-primary-200 dark:bg-primary-700/40" />
          </div>
        </div>
      )}
    </div>
  );
}
