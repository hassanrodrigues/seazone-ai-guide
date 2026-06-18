export type TravelMode = "walking" | "driving";

export interface MapsUrlOptions {
  originAddress: string;
  destinationName: string;
  destinationCity: string;
  travelMode?: TravelMode;
}

/**
 * Build a Google Maps directions deep link from the property to a venue.
 * Uses URLSearchParams so accents, spaces, and `&` are encoded correctly.
 * The destination is a single "name city" string — Google resolves it.
 */
export function buildMapsUrl({
  originAddress,
  destinationName,
  destinationCity,
  travelMode = "walking",
}: MapsUrlOptions): string {
  const params = new URLSearchParams({
    api: "1",
    origin: originAddress,
    destination: `${destinationName} ${destinationCity}`,
    travelmode: travelMode,
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Parse a PT-BR distance label into kilometers.
 * Handles comma decimals and m/km units: "500 m" -> 0.5, "Aprox. 1,2 km" -> 1.2.
 * Returns undefined when the distance is absent or unparseable (callers then
 * default to walking).
 */
export function parseDistanceKm(distance?: string): number | undefined {
  if (!distance) return undefined;
  const match = distance.match(/(\d+(?:[.,]\d+)?)\s*(km|m)\b/i);
  if (!match) return undefined;
  const value = Number.parseFloat(match[1].replace(",", "."));
  if (Number.isNaN(value)) return undefined;
  return match[2].toLowerCase() === "km" ? value : value / 1000;
}

/** Distances under this threshold (km) are walkable; at or above, drive. */
export const WALKING_THRESHOLD_KM = 5;

/** Pick a travel mode from a distance label: walking when near (or unknown), driving when far. */
export function travelModeForDistance(distance?: string): TravelMode {
  const km = parseDistanceKm(distance);
  return km !== undefined && km >= WALKING_THRESHOLD_KM ? "driving" : "walking";
}
