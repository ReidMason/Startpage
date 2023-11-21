"use server";

import { getUnixTime } from "@/utils/utils";
import { cacheIpInfo as cacheSaveIpInfo, getCacheData } from "../cache/cache";
import { IpInfo } from "./schema";

export async function getCachedIpInfo(ip: string): Promise<IpInfo | undefined> {
  const cache = await getCacheData();
  const ipInfo = cache.ipInfo[ip];

  if (ipInfo == undefined || getUnixTime() - ipInfo.timeObtained > 3600)
    return undefined;

  return ipInfo.data;
}

export async function cacheIpInfo(ip: string, ipInfo: IpInfo) {
  cacheSaveIpInfo(ip, ipInfo);
}
