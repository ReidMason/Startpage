import { z } from "zod";

export const themes = ["dark", "light"] as const;
const themesSchema = z.enum(themes);

export const appSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  icon: z.string(),
  enabled: z.boolean().default(true),
});

export const appearanceSchema = z.object({
  backgroundImageEnabled: z.boolean().default(false),
  backgroundImageKey: z.string().default(""),
  backgroundBlur: z.number().default(0),
  theme: themesSchema.default("dark"),
  opacity: z.number().default(100),
  glassy: z.number().default(0),
});

const providerSchema = z.object({
  id: z.string(),
  baseUrl: z.string(),
  prefix: z.string(),
  searchUrl: z.string(),
});

const weatherSchema = z.object({
  enabled: z.boolean().default(false),
  detailed: z.boolean().default(false),
});

const generalSchema = z.object({
  searchUrl: z.string().default("https://www.google.com/search?q="),
  calendarUrl: z.string().default("https://calendar.google.com/calendar/"),
  searchPlaceholder: z.string().default("Search..."),
});

export const configSchema = z.object({
  version: z.number().default(2),
  general: generalSchema.default({}),
  apps: z.array(appSchema).default([
    {
      id: "1",
      name: "YouTube",
      url: "https://www.youtube.com/",
      icon: "",
      enabled: true,
    },
  ]),
  weather: weatherSchema.default({}),
  providers: z.array(providerSchema).default([]),
  appearance: appearanceSchema.default({}),
});

export type Config = z.infer<typeof configSchema>;
export type GeneralConfig = z.infer<typeof generalSchema>;
export type App = z.infer<typeof appSchema>;
export type Provider = z.infer<typeof providerSchema>;
export type WeatherConfig = z.infer<typeof weatherSchema>;
