import Cookies from "js-cookie";

const IP_KEY = "location";

export function getIpCookie(): string | undefined {
  return Cookies.get(IP_KEY);
}

export function setIpCookie(ip: string) {
  Cookies.set(IP_KEY, ip, {
    sameSite: "strict",
    expires: 0.04166666667, // 1/24th of a day or one hour
  });
}
