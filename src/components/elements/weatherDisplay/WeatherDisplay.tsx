import { Icon } from "@iconify/react";
import Image from "next/image";
import { Config } from "../../../backend/routers/config/schemas";
import { Weather } from "../../../backend/routers/weather/schemas";

interface WeatherDisplayProps {
  weather: Weather;
  detailed: boolean;
  config: Config;
}

export default function WeatherDisplay({
  weather,
  detailed,
  config,
}: WeatherDisplayProps) {
  return (
    <div className="flex">
      <Image
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt="weather"
        width={100}
        height={100}
      />

      <div className="flex flex-col justify-center">
        <p className="mb-2 hidden capitalize md:block">{weather.description}</p>
        <div className="flex items-center justify-between gap-4 md:items-end">
          <p className="text-4xl">{Math.round(weather.temperature)}°C</p>
          {config.weather.detailed && (
            <div className="mb-1 flex items-center gap-1 text-lg">
              <Icon icon="bi:cloud-rain-heavy-fill" />
              <span>{Math.round(weather.rainChance * 100)}%</span>
            </div>
          )}
        </div>

        {detailed && (
          <div className="flex flex-col text-lg">
            <span>Feels Like {Math.round(weather.feelsLike)}°C</span>
          </div>
        )}
      </div>
    </div>
  );
}
