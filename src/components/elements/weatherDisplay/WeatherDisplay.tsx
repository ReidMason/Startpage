import { Icon } from "@iconify/react";
import Image from "next/image";
import useConfig from "../../../hooks/useConfig";
import useWeather from "../../../hooks/useWeather";

export default function WeatherDisplay() {
  const { config } = useConfig();
  const { weather } = useWeather(config.data);

  if (weather.isError || config.isError) return <></>;

  return (
    <>
      {weather.isLoading || weather.isIdle ? (
        <div className="flex animate-pulse items-center justify-center gap-4">
          <div className="h-20 w-20 rounded-full bg-slate-700"></div>
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 rounded-2xl bg-slate-700"></div>
            <div className="h-16 w-40 rounded-2xl bg-slate-700"></div>
          </div>
        </div>
      ) : (
        <div className="flex">
          <Image
            src={`https://openweathermap.org/img/wn/${
              weather.data!.icon
            }@2x.png`}
            alt="weather"
            width={100}
            height={100}
          />

          <div className="flex flex-col justify-center">
            <p className="mb-2 hidden capitalize md:block">
              {weather.data!.description}
            </p>
            <div className="flex items-center justify-between gap-4 md:items-end">
              <p className="text-4xl">
                {Math.round(weather.data!.temperature)}°C
              </p>
              {config.data?.weather.detailed && (
                <div className="mb-1 flex items-center gap-1 text-lg">
                  <Icon icon="bi:cloud-rain-heavy-fill" />
                  <span>{Math.round(weather.data!.rainChance * 100)}%</span>
                </div>
              )}
            </div>

            {config.data?.weather.detailed && (
              <div className="flex flex-col text-lg">
                <span>Feels Like {Math.round(weather.data!.feelsLike)}°C</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
