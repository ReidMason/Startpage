import { z } from "zod";

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
});

export type Config = z.infer<typeof configSchema>;
