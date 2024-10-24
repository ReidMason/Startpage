import { v4 as uuidv4 } from "uuid";

export function getUnixTime(): number {
  // Gets unix time in seconds
  return Math.floor(Date.now() / 1000);
}

export function roundToDecimal(value: number, decimal: number): number {
  return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function generateUuid(): string {
  return uuidv4();
}

export function isValidUrl(text: string) {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function hexToHSL(H: string): string {
  // Convert hex to RGB first
  let rStr = "0",
    gStr = "0",
    bStr = "0";
  if (H.length == 4) {
    rStr = "0x" + H[1] + H[1];
    gStr = "0x" + H[2] + H[2];
    bStr = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    rStr = "0x" + H[1] + H[2];
    gStr = "0x" + H[3] + H[4];
    bStr = "0x" + H[5] + H[6];
  }
  // Then to HSL
  const r = parseInt(rStr) / 255;
  const g = parseInt(gStr) / 255;
  const b = parseInt(bStr) / 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s} ${l}`;
}

export function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
