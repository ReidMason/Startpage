import type { Config } from "../../../backend/routers/config/schemas";
import type { Weather } from "../../../backend/routers/weather/schemas";
import GreetingText from "../../elements/greetingText/GreetingText";
import WeatherDisplay from "../../elements/weatherDisplay/WeatherDisplay";

interface GreetingProps {
  weather: Weather;
  config: Config;
}

export default function Greeting({ weather, config }: GreetingProps) {
  return (
    <div className="flex flex-col">
      <div className="sm:flex">
        <GreetingText config={config} />
        {config.weather.enabled && (
          <div className="ml-auto">
            <WeatherDisplay
              config={config}
              weather={weather}
              detailed={config.weather.detailed}
            />
          </div>
        )}
      </div>
    </div>
  );
}
