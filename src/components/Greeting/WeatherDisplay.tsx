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
import { getIpInfo } from "@/services/ipInfo/ipInfo";
import { getIpCookie, setIpCookie } from "@/services/cookies/cookies";
import { getCachedIpInfo, cacheIpInfo } from "@/services/ipInfo/cachedIpInfo";
import { IpInfo } from "@/services/ipInfo/schema";

interface WeatherDisplayProps {
  config: Config;
}

export default function WeatherDisplay({ config }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);

  const getWeatherFromIp = async () => {
    let newIpInfo: IpInfo | undefined = undefined;

    const ip = getIpCookie();
    if (ip != undefined) {
      newIpInfo = await getCachedIpInfo(ip);
    }

    if (newIpInfo == undefined) {
      newIpInfo = await getIpInfo();
      if (newIpInfo != undefined) {
        cacheIpInfo(newIpInfo.query, newIpInfo);
        setIpCookie(newIpInfo.query);
      }
    }

    if (newIpInfo != undefined) {
      updateWeather(newIpInfo.lat, newIpInfo.lon);
      setIpInfo(newIpInfo);
    }
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

    getWeatherFromIp();
  }, []);

  return (
    <div className="text-primary-100">
      {!!weather ? (
        <div className="flex">
          <div>
            <Image
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
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
            {ipInfo && <p>{ipInfo.city}</p>}
          </div>
        </div>
      ) : (
        <div className="flex h-[124px] animate-pulse space-x-4">
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
