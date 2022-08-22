import { Icon } from "@iconify/react";
import Image from "next/image";
import { Weather } from "../../../services/server/weather/types";

interface WeatherDisplayProps {
  weatherData: Weather;
  detailed?: boolean;
}

export default function WeatherDisplay({
  weatherData,
  detailed,
}: WeatherDisplayProps) {
  return (
    <div className="flex">
      <Image
        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
        alt="weather"
        width={100}
        height={100}
      />
      <div className="flex flex-col justify-center">
        <p className="mb-2 hidden capitalize md:block">
          {weatherData.description}
        </p>
        <div className="flex items-center justify-between gap-4 md:items-end">
          <p className="text-4xl">{Math.round(weatherData.temperature)}°C</p>
          {detailed && (
            <div className="mb-1 flex items-center gap-1 text-lg">
              <Icon icon="bi:cloud-rain-heavy-fill" />
              <span>{Math.round(weatherData.rainChance * 100)}%</span>
            </div>
          )}
        </div>

        {detailed && (
          <div className="flex flex-col text-lg">
            <span>Feels Like {Math.round(weatherData.feelsLike)}°C</span>
          </div>
        )}
      </div>
    </div>
  );
}
