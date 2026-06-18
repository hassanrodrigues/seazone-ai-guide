// Normalized shape of a venue returned by the Google Places API (New). The raw
// API response is mapped into this in places.service.ts so the rest of the app
// never deals with Google's nested field shapes.
export interface RealPlace {
  name: string;
  address: string;
  rating?: number;
  ratingCount?: number;
  types: string[];
  priceLevel?: string;
}

export interface PlacesApiResponse {
  places: RealPlace[];
}
