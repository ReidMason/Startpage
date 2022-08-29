import { z } from "zod";

export const appearances = ["dark", "light", "system"] as const;
export const themes = ["default"] as const;

const appSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  icon: z.string(),
  enabled: z.boolean().optional(),
});

const providerSchema = z.object({
  id: z.string(),
  baseUrl: z.string(),
  name: z.string(),
  prefix: z.string(),
  searchUrl: z.string(),
});

export const configSchema = z.object({
  version: z.number().default(1),
  general: z
    .object({
      searchUrl: z.string().default("https://www.google.com/search?q="),
      customSearchUrl: z.string().default(""),
      customSearchEnabled: z.boolean().default(false),
      calendarUrl: z.string().default("https://calendar.google.com/calendar/"),
      searchPlaceholder: z.string().default("Search..."),
      cacheKey: z.number().default(Math.random),
    })
    .default({}),
  apps: z.array(appSchema).default([]),
  providers: z.array(providerSchema).default([]),
  weather: z
    .object({
      enabled: z.boolean().default(false),
      location: z.string().default(""),
      detailed: z.boolean().default(false),
      apiKey: z.string().default(""),
    })
    .default({}),
  appearance: z
    .object({
      backgroundEnabled: z.boolean().default(false),
      theme: z.enum(themes).default("default"),
      appearance: z.enum(appearances).default("system"),
      glassy: z.boolean().default(false),
    })
    .default({}),
});

export type Config = z.infer<typeof configSchema>;
const deepPartialConfig = configSchema.deepPartial();
export type PartialConfig = z.infer<typeof deepPartialConfig>;
export type App = z.infer<typeof appSchema>;
export type Provider = z.infer<typeof providerSchema>;
