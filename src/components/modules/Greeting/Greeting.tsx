import React from "react";
import { configSchema } from "../../../backend/routers/config/schemas";
import { Weather } from "../../../backend/routers/weather/schemas";
import GreetingText from "../GreetingText";
import WeatherDisplay from "../WeatherDisplay";

interface GreetingProps {
  config: Config;
  weatherData?: Weather | null;
  editMode: boolean;
  appFilter: string;
}

export default function Greeting({ config, weatherData }: GreetingProps) {
  return (
    <div className="flex flex-col">
      <div className="sm:flex">
        <GreetingText calendarUrl={config.general.calendarUrl} />
        <div className="ml-auto">
          {config.weather.enabled && weatherData && (
            <WeatherDisplay
              weatherData={weatherData}
              detailed={config.weather.detailed}
            />
          )}
        </div>
      </div>
    </div>
  );
}
