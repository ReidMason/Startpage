export function getUnixTime(): number {
  // Gets unix time in seconds
  return Math.floor(Date.now() / 1000);
}
