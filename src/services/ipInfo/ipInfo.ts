import { IpInfo, ipInfoSchema } from "./schema";

export async function getIpInfo(): Promise<IpInfo | undefined> {
  const resp = await fetch("http://ip-api.com/json/");
  const data = await resp.json();

  const result = await ipInfoSchema.safeParseAsync(data);
  if (result.success) return result.data;

  return undefined;
}
