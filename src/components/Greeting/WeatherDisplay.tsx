"use client";

import { WeatherConfig } from "@/services/config/schemas";
import { getWeatherData } from "@/services/weather/weather";
import Image from "next/image";
import Icon from "../Icon/Icon";
import { useEffect, useState } from "react";
import { Weather } from "@/services/weather/schemas";

interface WeatherDisplayProps {
  config: WeatherConfig;
}

export default function WeatherDisplay({ config }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<Weather | null>(null);

  const updateWeatherFromLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const weatherData = await getWeatherData(
        position.coords.latitude,
        position.coords.longitude,
        new Date(),
      );
      setWeather(weatherData);
    }, console.error);
  };

  useEffect(() => {
    updateWeatherFromLocation();
  }, []);

  return (
    <div className="text-accent-foreground">
      {!!weather ? (
        <div className="flex">
          <div>
            <Image
              src={weather.imageUrl}
              alt="weather"
              width={100}
              height={100}
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-2 hidden capitalize md:block">
              {weather.description}
            </p>
            <div className="flex items-center justify-between gap-4 md:items-end">
              <p className="text-4xl">{Math.round(weather.temperature)}°C</p>
              {config.detailed && (
                <div className="mb-1 flex items-center gap-1 text-lg">
                  <Icon icon="bi:cloud-rain-heavy-fill" />
                  <span>{Math.round(weather.rainChance * 100)}%</span>
                </div>
              )}
            </div>

            {config.detailed && (
              <div className="flex flex-col text-lg">
                <span>Feels Like {Math.round(weather.feelsLike)}°C</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-[124px] animate-pulse space-x-4">
          <div className="flex h-full items-center">
            <div className="h-16 w-16 rounded-full bg-accent" />
          </div>
          <div className="flex w-36 flex-col gap-2">
            <div className="h-6 rounded-xl bg-accent" />
            <div className="h-16 rounded-xl bg-accent" />
          </div>
        </div>
      )}
    </div>
  );
}
