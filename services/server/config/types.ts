export interface Config {
  version: number;
  general: GeneralConfig;
  apps: Array<App>;
  providers: Array<Provider>;
  weather: WeatherConfig;
  appearance: AppearanceConfig;
}

export interface AppearanceConfig {
  backgroundEnabled: boolean;
  theme: string;
  appearance: Appearance;
  glassy: boolean;
}

export const appearances = ["dark", "light", "system"] as const;
export type Appearance = typeof appearances[number];

export interface GeneralConfig {
  searchUrl: string;
  customSearchUrl: string;
  customSearchEnabled: boolean;
  calendarUrl: string;
  searchPlaceholder: string;
  cacheKey: number;
}

export interface WeatherConfig {
  enabled: boolean;
  location: string;
  detailed: boolean;
  apiKey: string;
}

export interface Provider {
  id: string;
  baseUrl: string;
  name: string;
  prefix: string;
  searchUrl: string;
}

export interface App {
  id: string;
  name: string;
  url: string;
  icon: string;
  active?: boolean;
}
