import GreetingText from "../../elements/greetingText/GreetingText";
import WeatherDisplay from "../../elements/weatherDisplay/WeatherDisplay";

export default function Greeting() {
  return (
    <div className="flex flex-col">
      <div className="sm:flex">
        <GreetingText />
        <div className="ml-auto">
          <WeatherDisplay />
        </div>
      </div>
    </div>
  );
}
