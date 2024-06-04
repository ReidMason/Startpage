import { Weather } from "../routers/weather/schemas";

export default interface Cache {
  cachedWeatherData: Array<WeatherDataCache>;
}

interface WeatherDataCache {
  timeObtained: number;
  location: string;
  weatherData: Weather;
}
