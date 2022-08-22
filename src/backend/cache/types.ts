import { Weather } from "../routers/weather/types";

export default interface Cache {
  cachedWeatherData: Array<WeatherDataCache>;
}

interface WeatherDataCache {
  timeObtained: number;
  location: string;
  weatherData: Weather;
}
