import { PlacesApiError } from "@/lib/errors";
import type { RealPlace } from "@/lib/types/places";

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

// Only the fields we actually use — the FieldMask is mandatory and also caps
// billing to the requested fields.
const FIELD_MASK = [
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.types",
  "places.priceLevel",
].join(",");

// Raw shape of a place in the Places API (New) response.
interface RawPlace {
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  priceLevel?: string;
}

/**
 * Search real venues via the Google Places API (New). Used to ground guide
 * generation in places that actually exist. Throws PlacesApiError on any
 * failure (missing key, permission denied, rate limit, network) — callers are
 * expected to catch it and fall back to ungrounded generation.
 */
export async function findRealPlaces(
  query: string,
  location: string,
): Promise<RealPlace[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new PlacesApiError("GOOGLE_PLACES_API_KEY não configurada.");
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: `${query} ${location}`,
        languageCode: "pt-BR",
        regionCode: "BR",
        maxResultCount: 12,
      }),
    });
  } catch (error) {
    throw new PlacesApiError("Falha de rede ao consultar a Places API.", {
      cause: error,
    });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new PlacesApiError(
      `Places API retornou ${response.status}. ${detail.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as { places?: RawPlace[] };

  return (data.places ?? [])
    .map((p): RealPlace => ({
      name: p.displayName?.text ?? "",
      address: p.formattedAddress ?? "",
      rating: p.rating,
      ratingCount: p.userRatingCount,
      types: p.types ?? [],
      priceLevel: p.priceLevel,
    }))
    .filter((p) => p.name.length > 0);
}
