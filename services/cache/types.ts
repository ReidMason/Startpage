import WeatherData from "../../interfaces/WeatherData";

export default interface Cache {
  cachedWeatherData: Array<WeatherDataCache>;
}

interface WeatherDataCache {
  timeObtained: number;
  location: string;
  weatherData: WeatherData;
}
