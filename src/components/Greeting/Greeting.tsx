import type { Config } from "@/services/config/schemas";
import GreetingText from "./GreetingText";
import WeatherDisplay from "./WeatherDisplay";

interface GreetingProps {
  config: Config;
}

export default function Greeting({ config }: GreetingProps) {
  return (
    <div className="sm:flex justify-between">
      <GreetingText config={config.general} />
      {config.weather.enabled && <WeatherDisplay config={config.weather} />}
    </div>
  );
}
