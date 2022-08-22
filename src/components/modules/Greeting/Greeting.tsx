import React from "react";
import { ConfigSchema } from "../../../backend/routers/config/types";
import { Weather } from "../../../backend/routers/weather/types";
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
