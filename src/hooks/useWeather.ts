import { Config } from "../backend/routers/config/schemas";
import { trpc } from "../utils/trpc";

export default function useWeather(config?: Config) {
  return {
    weather: trpc.useQuery(
      [
        "weather.get",
        {
          location: config?.weather.location ?? "",
          apiKey: config?.weather.apiKey ?? "",
        },
      ],
      {
        enabled: !!config && config.weather.enabled,
      }
    ),
  };
}
