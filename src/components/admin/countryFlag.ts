/** ISO 3166-1 alpha-2 -> regional-indicator flag emoji. Falls back to a globe. */
export function countryFlag(code: string | null): string {
  if (!code) return "🌐";
  return code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
}
