import type { Property } from "@/app/generated/prisma/client";

// Typed shapes for the Json columns on Property. Prisma types these as
// `JsonValue`, which is unsafe to index; these interfaces are the single
// source of truth for the JSON structure stored by the seed and read across
// the app. Keep them in sync with docs/spec-data.json and prisma/seed.ts.

/** Postal address. `complement` is null for properties without one (e.g. GRM001, a standalone house). */
export interface PropertyAddress {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
}

/**
 * Access, WiFi and parking details — the operational data a guest needs on
 * arrival. Parking fields are only meaningful when `has_parking_spot` is true,
 * and `parking_spot_identifier` is optional (FLN001 has it, GRM001 doesn't).
 */
export interface PropertyOperational {
  wifi_network: string;
  wifi_password: string;
  is_self_checkin: boolean;
  property_access_type: string;
  property_access_instructions: string;
  property_password: string;
  has_parking_spot: boolean;
  parking_spot_identifier?: string;
  parking_spot_instructions?: string;
}

/** Stay rules. Times are "HH:mm" strings; the rest are policy toggles. */
export interface PropertyRules {
  check_in_time: string;
  check_out_time: string;
  allow_pet: boolean;
  smoking_permitted: boolean;
  suitable_for_children: boolean;
  suitable_for_babies: boolean;
  events_permitted: boolean;
}

/**
 * Amenities present in the property. Each key is optional and only set when
 * true — an absent key means "not offered". Keys vary per property, so this is
 * a partial record of known amenity flags rather than a fixed object.
 */
export interface PropertyAmenities {
  wifi?: boolean;
  tv?: boolean;
  air_conditioning?: boolean;
  kitchen?: boolean;
  washing_machine?: boolean;
  dishwasher?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  bbq_grill?: boolean;
  pool?: boolean;
  parking?: boolean;
}

/** Host contact for the fallback path when the assistant can't answer. */
export interface PropertyHost {
  name: string;
  phone: string;
}

/**
 * A Property with its Json columns narrowed to the concrete shapes above.
 * Services return this so callers get type-safe access to nested fields
 * without re-casting JsonValue at every use site.
 */
export type TypedProperty = Omit<
  Property,
  "address" | "operational" | "rules" | "amenities" | "host"
> & {
  address: PropertyAddress;
  operational: PropertyOperational;
  rules: PropertyRules;
  amenities: PropertyAmenities;
  host: PropertyHost;
};
