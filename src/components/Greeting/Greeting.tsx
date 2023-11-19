import type { Config } from "@/services/config/schemas";
import GreetingText from "./GreetingText";
import WeatherDisplay from "./WeatherDisplay";

interface GreetingProps {
  config: Config;
}

export default function Greeting({ config }: GreetingProps) {
  return (
    <div className="flex flex-col">
      <div className="sm:flex">
        <GreetingText config={config} />
        {config.weather.enabled && (
          <div className="ml-auto">
            <WeatherDisplay config={config} />
          </div>
        )}
      </div>
    </div>
  );
}
