"use server";

import {
  type Weather,
  type WeatherDataResponse,
  weatherDataResponseSchema,
} from "./schemas";
import { cacheWeatherData, getCachedWeatherData } from "../cache/cache";

export async function getWeatherData(
  lat: number,
  lon: number,
  time: Date,
): Promise<Weather | null> {
  console.log(`Getting weather data for: ${lat}, ${lon}`);
  const weatherResponse =
    (await getCachedWeatherData(lat, lon)) ??
    (await requestWeatherData(lat, lon));

  if (!weatherResponse) return null;

  const weatherData = weatherDataResponseToWeatherData(weatherResponse, time);

  return weatherData;
}

async function requestWeatherData(
  latitude: number,
  longitude: number,
): Promise<WeatherDataResponse | null> {
  console.log(`Requesting weather data for: ${latitude}, ${longitude}`);
  const params = {
    latitude,
    longitude,
    current: [
      "temperature_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
    ],
    hourly: ["precipitation_probability"],
    forecast_days: 1,
  };

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.append("latitude", params.latitude.toString());
  url.searchParams.append("longitude", params.longitude.toString());
  url.searchParams.append("current", params.current.join(","));
  url.searchParams.append("hourly", params.hourly.join(","));
  url.searchParams.append("forecast_days", params.forecast_days.toString());

  const response = await fetch(url);
  if (response.status !== 200) {
    console.error(`Failed to fetch weather data: ${response.statusText}`);
    return null;
  }

  const result = weatherDataResponseSchema.safeParse(await response.json());
  if (!result.success) {
    console.error("Failed to parse weather data response", result.error);
    return null;
  }

  await cacheWeatherData(latitude, longitude, result.data);
  return result.data;
}

function weatherDataResponseToWeatherData(
  weatherDataResponse: WeatherDataResponse,
  time: Date,
): Weather {
  const isDay = Math.floor(time.getHours() / 6) % 3 !== 0;

  const weatherCodeData = getWeatherCodeData(
    weatherDataResponse.current.weather_code,
  );
  const timeWeatherData = isDay ? weatherCodeData.day : weatherCodeData.night;

  const timeIndex = weatherDataResponse.hourly.time.findIndex((hour) => {
    return hour.getTime() > time.getTime();
  });
  const rainChance =
    weatherDataResponse.hourly.precipitation_probability[timeIndex - 1];

  return {
    temperature: weatherDataResponse.current.temperature_2m,
    feelsLike: weatherDataResponse.current.apparent_temperature,
    description: timeWeatherData.description,
    imageUrl: timeWeatherData.image,
    rainChance: rainChance,
  };
}

const weatherCodeMap: WeatherCodeMap = {
  "0": {
    day: {
      description: "Sunny",
      image: "https://openweathermap.org/img/wn/01d@2x.png",
    },
    night: {
      description: "Clear",
      image: "https://openweathermap.org/img/wn/01n@2x.png",
    },
  },
  "1": {
    day: {
      description: "Mainly Sunny",
      image: "https://openweathermap.org/img/wn/01d@2x.png",
    },
    night: {
      description: "Mainly Clear",
      image: "https://openweathermap.org/img/wn/01n@2x.png",
    },
  },
  "2": {
    day: {
      description: "Partly Cloudy",
      image: "https://openweathermap.org/img/wn/02d@2x.png",
    },
    night: {
      description: "Partly Cloudy",
      image: "https://openweathermap.org/img/wn/02n@2x.png",
    },
  },
  "3": {
    day: {
      description: "Cloudy",
      image: "https://openweathermap.org/img/wn/03d@2x.png",
    },
    night: {
      description: "Cloudy",
      image: "https://openweathermap.org/img/wn/03n@2x.png",
    },
  },
  "45": {
    day: {
      description: "Foggy",
      image: "https://openweathermap.org/img/wn/50d@2x.png",
    },
    night: {
      description: "Foggy",
      image: "https://openweathermap.org/img/wn/50n@2x.png",
    },
  },
  "48": {
    day: {
      description: "Rime Fog",
      image: "https://openweathermap.org/img/wn/50d@2x.png",
    },
    night: {
      description: "Rime Fog",
      image: "https://openweathermap.org/img/wn/50n@2x.png",
    },
  },
  "51": {
    day: {
      description: "Light Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "53": {
    day: {
      description: "Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "55": {
    day: {
      description: "Heavy Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Heavy Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "56": {
    day: {
      description: "Light Freezing Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Freezing Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "57": {
    day: {
      description: "Freezing Drizzle",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Freezing Drizzle",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "61": {
    day: {
      description: "Light Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Light Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "63": {
    day: {
      description: "Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "65": {
    day: {
      description: "Heavy Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Heavy Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "66": {
    day: {
      description: "Light Freezing Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Light Freezing Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "67": {
    day: {
      description: "Freezing Rain",
      image: "https://openweathermap.org/img/wn/10d@2x.png",
    },
    night: {
      description: "Freezing Rain",
      image: "https://openweathermap.org/img/wn/10n@2x.png",
    },
  },
  "71": {
    day: {
      description: "Light Snow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Light Snow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "73": {
    day: {
      description: "Snow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "75": {
    day: {
      description: "Heavy Snow",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Heavy Snow",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "77": {
    day: {
      description: "Snow Grains",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow Grains",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "80": {
    day: {
      description: "Light Showers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Light Showers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "81": {
    day: {
      description: "Showers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Showers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "82": {
    day: {
      description: "Heavy Showers",
      image: "https://openweathermap.org/img/wn/09d@2x.png",
    },
    night: {
      description: "Heavy Showers",
      image: "https://openweathermap.org/img/wn/09n@2x.png",
    },
  },
  "85": {
    day: {
      description: "Light Snow Showers",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Light Snow Showers",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "86": {
    day: {
      description: "Snow Showers",
      image: "https://openweathermap.org/img/wn/13d@2x.png",
    },
    night: {
      description: "Snow Showers",
      image: "https://openweathermap.org/img/wn/13n@2x.png",
    },
  },
  "95": {
    day: {
      description: "Thunderstorm",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Thunderstorm",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
  "96": {
    day: {
      description: "Light Thunderstorms With Hail",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Light Thunderstorms With Hail",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
  "99": {
    day: {
      description: "Thunderstorm With Hail",
      image: "https://openweathermap.org/img/wn/11d@2x.png",
    },
    night: {
      description: "Thunderstorm With Hail",
      image: "https://openweathermap.org/img/wn/11n@2x.png",
    },
  },
};

interface WeatherCodeMap {
  [key: string]: WeatherCodeData;
}

interface WeatherCodeData {
  day: WeatherTimeData;
  night: WeatherTimeData;
}

interface WeatherTimeData {
  description: string;
  image: string;
}

function getWeatherCodeData(weatherCode: number): WeatherCodeData {
  const data = weatherCodeMap[weatherCode.toString()];

  if (!data) {
    console.error(`Unknown weather code: ${weatherCode}`);
    return weatherCodeMap["0"];
  }

  // TODO: Determine if it's day or night
  return data;
}
