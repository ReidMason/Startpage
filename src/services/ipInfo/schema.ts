import { z } from "zod";

export const ipInfoSchema = z.object({
  status: z.string(),
  country: z.string(),
  countryCode: z.string(),
  region: z.string(),
  regionName: z.string(),
  city: z.string(),
  zip: z.string(),
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  isp: z.string(),
  org: z.string(),
  as: z.string(),
  query: z.string(),
});

export type IpInfo = z.infer<typeof ipInfoSchema>;
