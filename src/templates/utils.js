export function isBot(userAgent) {
  return /googlebot|bingbot/i.test(userAgent);
}
