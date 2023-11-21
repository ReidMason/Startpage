import { IpInfo, ipInfoSchema } from "./schema";

export async function getIpInfo(): Promise<IpInfo | undefined> {
  console.log("Getting ip data");
  const resp = await fetch("http://ip-api.com/json/");
  const data = await resp.json();

  const result = await ipInfoSchema.safeParseAsync(data);
  if (result.success) return result.data;

  return undefined;
}
