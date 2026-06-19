import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../app/generated/prisma/client";
import type {
  PropertyAddress,
  PropertyAmenities,
  PropertyHost,
  PropertyOperational,
  PropertyRules,
} from "../lib/types/property";

// Standalone client for the seed script (run via tsx, outside Next.js). Uses
// the same pg adapter as lib/db.ts; DATABASE_URL comes from dotenv above.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface SeedProperty {
  code: string;
  name: string;
  propertyType: string;
  bedroomQuantity: number;
  bathroomQuantity: number;
  guestCapacity: number;
  address: PropertyAddress;
  operational: PropertyOperational;
  rules: PropertyRules;
  amenities: PropertyAmenities;
  images: string[];
  host: PropertyHost;
}

// FLN001 and GRM001 are verbatim from docs/spec-data.json (reference data).
// SP001 and SAL001 are invented fixtures following the same structure, chosen to
// exercise distinct rule/amenity combinations (pet-friendly penthouse with pool;
// beach house that allows events).
const properties: SeedProperty[] = [
  {
    code: "FLN001",
    name: "Apartamento Beira-Mar Florianópolis",
    propertyType: "Apartamento",
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
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
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
      balcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    host: {
      name: "Ana Paula",
      phone: "+5548991234567",
    },
  },
  {
    code: "GRM001",
    name: "Chalé Serra Gramado",
    propertyType: "Casa",
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    address: {
      street: "Rua das Hortênsias",
      number: "220",
      complement: null,
      neighborhood: "Planalto",
      city: "Gramado",
      state: "RS",
      postal_code: "95670-000",
    },
    operational: {
      wifi_network: "ChaletSerra_GRM",
      wifi_password: "gramado@2024",
      is_self_checkin: false,
      property_access_type: "keybox",
      property_access_instructions: "A chave está no cofre na entrada. Código: 1983",
      property_password: "1983",
      has_parking_spot: true,
      parking_spot_instructions: "Garagem própria para 2 carros",
    },
    rules: {
      check_in_time: "14:00",
      check_out_time: "12:00",
      allow_pet: true,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: false,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      bbq_grill: true,
      balcony: true,
      dishwasher: true,
    },
    images: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800",
    ],
    host: {
      name: "Carlos Eduardo",
      phone: "+5554998765432",
    },
  },
  {
    code: "SP001",
    name: "Cobertura Vila Madalena",
    propertyType: "Cobertura",
    bedroomQuantity: 2,
    bathroomQuantity: 2,
    guestCapacity: 4,
    address: {
      street: "Rua Harmonia",
      number: "456",
      complement: "Cobertura 02",
      neighborhood: "Vila Madalena",
      city: "São Paulo",
      state: "SP",
      postal_code: "05435-000",
    },
    operational: {
      wifi_network: "VilaMada_SP001",
      wifi_password: "sampa@2024",
      is_self_checkin: true,
      property_access_type: "smart_lock",
      property_access_instructions: "Use o código 3098 na fechadura digital da porta principal",
      property_password: "3098",
      has_parking_spot: true,
      parking_spot_identifier: "Vaga 45 — térreo",
      parking_spot_instructions: "Entrada pela Rua Aspicuelta, acione o interfone 102",
    },
    rules: {
      check_in_time: "15:00",
      check_out_time: "11:00",
      allow_pet: true,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: true,
      events_permitted: false,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
      balcony: true,
      pool: true,
    },
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    host: {
      name: "Mariana Costa",
      phone: "+5511987654321",
    },
  },
  {
    code: "SAL001",
    name: "Casa de Praia Itapuã",
    propertyType: "Casa",
    bedroomQuantity: 4,
    bathroomQuantity: 3,
    guestCapacity: 8,
    address: {
      street: "Rua da Música",
      number: "78",
      complement: null,
      neighborhood: "Itapuã",
      city: "Salvador",
      state: "BA",
      postal_code: "41610-000",
    },
    operational: {
      wifi_network: "CasaItapua_SAL",
      wifi_password: "salvador@2024",
      is_self_checkin: false,
      property_access_type: "host_greeting",
      property_access_instructions: "O caseiro Seu João recebe os hóspedes no portão a partir das 14h",
      property_password: "2580",
      has_parking_spot: true,
      parking_spot_instructions: "Garagem coberta na frente da casa para até 3 carros",
    },
    rules: {
      check_in_time: "14:00",
      check_out_time: "12:00",
      allow_pet: true,
      smoking_permitted: false,
      suitable_for_children: true,
      suitable_for_babies: true,
      events_permitted: true,
    },
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      pool: true,
      bbq_grill: true,
      balcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
    ],
    host: {
      name: "Roberto Santos",
      phone: "+5571991112233",
    },
  },
];

// The typed interfaces above give us authoring safety (typos in the seed data
// are caught at compile time), but Prisma's Json input type requires an index
// signature that named interfaces don't have — so cast the Json fields only at
// this boundary, where the shape has already been validated.
type PropertyData = Omit<Prisma.PropertyCreateInput, "code">;

function toData(property: SeedProperty): PropertyData {
  const { code: _code, address, operational, rules, amenities, host, ...rest } =
    property;
  void _code;
  return {
    ...rest,
    address: address as unknown as Prisma.InputJsonValue,
    operational: operational as unknown as Prisma.InputJsonValue,
    rules: rules as unknown as Prisma.InputJsonValue,
    amenities: amenities as unknown as Prisma.InputJsonValue,
    host: host as unknown as Prisma.InputJsonValue,
  };
}

async function main() {
  for (const property of properties) {
    const data = toData(property);
    // Upsert keeps the seed idempotent: re-running refreshes data without
    // duplicating rows or failing on existing codes.
    await prisma.property.upsert({
      where: { code: property.code },
      create: { code: property.code, ...data },
      update: data,
    });
    console.log(`Seeded ${property.code} — ${property.name}`);
  }
  console.log(`\nDone. ${properties.length} properties seeded.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
