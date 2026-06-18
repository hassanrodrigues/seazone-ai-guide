import type { ExperienceGuide } from "@/lib/ai/schemas";
import type { TypedProperty } from "@/lib/types/property";

/** Minimal but complete FLN001 fixture (pet NOT allowed). */
export const flnProperty: TypedProperty = {
  code: "FLN001",
  name: "Apartamento Beira-Mar Florianópolis",
  propertyType: "Apartamento",
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  address: {
    street: "Rua Lauro Linhares",
    number: "589",
    complement: "Apto 301",
    neighborhood: "Trindade",
    city: "Florianópolis",
    state: "SC",
    postal_code: "88036-001",
  },
  operational: {
    wifi_network: "SeaHome_FLN001",
    wifi_password: "floripa2024",
    is_self_checkin: true,
    property_access_type: "smart_lock",
    property_access_instructions: "Use o código 4521 na fechadura eletrônica",
    property_password: "4521",
    has_parking_spot: true,
    parking_spot_identifier: "Vaga 12 — subsolo B1",
    parking_spot_instructions: "Portão lateral, código 7890 no interfone",
  },
  rules: {
    check_in_time: "15:00",
    check_out_time: "11:00",
    allow_pet: false,
    smoking_permitted: false,
    suitable_for_children: true,
    suitable_for_babies: true,
    events_permitted: false,
  },
  amenities: { wifi: true, tv: true, air_conditioning: true, kitchen: true },
  host: { name: "Ana Paula", phone: "+5548991234567" },
};

/** GRM001 fixture (pet allowed, no complement) — for cross-property assertions. */
export const grmProperty: TypedProperty = {
  ...flnProperty,
  code: "GRM001",
  name: "Chalé Serra Gramado",
  propertyType: "Casa",
  address: {
    street: "Rua das Hortênsias",
    number: "220",
    complement: null,
    neighborhood: "Planalto",
    city: "Gramado",
    state: "RS",
    postal_code: "95670-000",
  },
  rules: { ...flnProperty.rules, allow_pet: true },
  host: { name: "Carlos Eduardo", phone: "+5554998765432" },
};

/** A schema-valid generated guide for grounding tests. */
export const sampleGuide: ExperienceGuide = {
  welcomeMessage: "Bem-vindos à Trindade, o coração universitário de Florianópolis!",
  restaurants: [
    { name: "Box 32", cuisine: "Frutos do mar", distance: "Aprox. 1,2 km", priceRange: "$$", description: "Petiscos no Mercado Público." },
    { name: "Armazém Vieira", cuisine: "Frutos do mar", distance: "Aprox. 2,5 km", priceRange: "$$$", description: "Referência em frutos do mar." },
    { name: "Lagoa Viva", cuisine: "Brasileira", distance: "Aprox. 1,5 km", priceRange: "$$", description: "Cozinha contemporânea." },
    { name: "Ataliba", cuisine: "Churrascaria", distance: "Aprox. 2,0 km", priceRange: "$$", description: "Rodízio de carnes." },
  ],
  attractions: [
    { name: "Lagoa da Conceição", category: "natureza", distance: "Aprox. 8 km", description: "Cartão-postal da ilha." },
    { name: "Campus da UFSC", category: "cultural", distance: "Aprox. 0,5 km", description: "Universidade federal." },
    { name: "Mercado Público", category: "cultural", distance: "Aprox. 5 km", description: "Mercado histórico." },
  ],
  essentials: [
    { name: "Farmácia Catarinense", type: "pharmacy", distance: "Aprox. 0,4 km", description: "Aberta até 22h." },
    { name: "Supermercado Imperatriz", type: "supermarket", distance: "Aprox. 0,7 km", description: "Mercado completo." },
  ],
  seasonalTip: "Em junho o clima é ameno; leve um casaco para as noites.",
};
