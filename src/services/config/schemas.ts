import { z } from "zod";

const appSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  icon: z.string(),
  enabled: z.boolean().default(true),
});

export const configSchema = z.object({
  version: z.number().default(2),
  general: z
    .object({
      searchUrl: z.string().default("https://www.google.com/search?q="),
      customSearchUrl: z.string().default(""),
      customSearchEnabled: z.boolean().default(false),
      calendarUrl: z.string().default("https://calendar.google.com/calendar/"),
      searchPlaceholder: z.string().default("Search..."),
    })
    .default({}),
  apps: z.array(appSchema).default([
    {
      id: "1",
      name: "YouTube",
      url: "https://www.youtube.com/",
      icon: "",
      enabled: true,
    },
  ]),
});

export type Config = z.infer<typeof configSchema>;
export type App = z.infer<typeof appSchema>;
