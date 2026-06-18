import { describe, expect, it } from "vitest";

import { ExperienceGuideSchema } from "@/lib/ai/schemas";

// Builders for arrays of valid items, so each test varies only what it asserts.
const restaurant = (priceRange = "$$") => ({
  name: "Box 32",
  cuisine: "Frutos do mar",
  distance: "Aprox. 1,2 km",
  priceRange,
  description: "Petiscos no Mercado Público.",
});
const attraction = () => ({
  name: "Lagoa da Conceição",
  category: "natureza",
  distance: "Aprox. 8 km",
  description: "Cartão-postal da ilha.",
});
const essential = (type = "pharmacy") => ({
  name: "Farmácia Catarinense",
  type,
  distance: "Aprox. 0,4 km",
  description: "Aberta até 22h.",
});

const restaurants = (n: number) => Array.from({ length: n }, () => restaurant());
const attractions = (n: number) => Array.from({ length: n }, () => attraction());
const essentials = (n: number) => Array.from({ length: n }, () => essential());

// A fully-valid payload: 4 restaurants, 3 attractions, 2 essentials.
const validPayload = () => ({
  welcomeMessage: "Bem-vindos à Trindade!",
  restaurants: restaurants(4),
  attractions: attractions(3),
  essentials: essentials(2),
  seasonalTip: "Em junho o clima é ameno.",
});

describe("ExperienceGuideSchema", () => {
  it("accepts a fully-formed valid payload", () => {
    expect(ExperienceGuideSchema.safeParse(validPayload()).success).toBe(true);
  });

  it("rejects payload with fewer than 3 restaurants", () => {
    const r = ExperienceGuideSchema.safeParse({
      ...validPayload(),
      restaurants: restaurants(2),
    });
    expect(r.success).toBe(false);
  });

  it("rejects payload with more than 5 restaurants", () => {
    const r = ExperienceGuideSchema.safeParse({
      ...validPayload(),
      restaurants: restaurants(6),
    });
    expect(r.success).toBe(false);
  });

  it("rejects payload with fewer than 3 attractions", () => {
    const r = ExperienceGuideSchema.safeParse({
      ...validPayload(),
      attractions: attractions(2),
    });
    expect(r.success).toBe(false);
  });

  it("rejects payload with fewer than 2 essentials", () => {
    const r = ExperienceGuideSchema.safeParse({
      ...validPayload(),
      essentials: essentials(1),
    });
    expect(r.success).toBe(false);
  });

  it("rejects payload missing welcomeMessage", () => {
    const { welcomeMessage: _omit, ...rest } = validPayload();
    void _omit;
    expect(ExperienceGuideSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects payload missing seasonalTip", () => {
    const { seasonalTip: _omit, ...rest } = validPayload();
    void _omit;
    expect(ExperienceGuideSchema.safeParse(rest).success).toBe(false);
  });

  it("accepts every valid priceRange value ($, $$, $$$)", () => {
    for (const price of ["$", "$$", "$$$"]) {
      const r = ExperienceGuideSchema.safeParse({
        ...validPayload(),
        restaurants: [
          restaurant(price),
          restaurant(),
          restaurant(),
        ],
      });
      expect(r.success, `priceRange "${price}" should be valid`).toBe(true);
    }
  });

  it("rejects a restaurant with an invalid priceRange ($$$$)", () => {
    const r = ExperienceGuideSchema.safeParse({
      ...validPayload(),
      restaurants: [restaurant("$$$$"), restaurant(), restaurant()],
    });
    expect(r.success).toBe(false);
  });

  it("accepts essentials with every valid type", () => {
    const types = ["pharmacy", "supermarket", "hospital", "bakery", "atm", "post_office"];
    for (const type of types) {
      const r = ExperienceGuideSchema.safeParse({
        ...validPayload(),
        essentials: [essential(type), essential()],
      });
      expect(r.success, `essential type "${type}" should be valid`).toBe(true);
    }
  });

  it("rejects an essential with an invalid type", () => {
    const r = ExperienceGuideSchema.safeParse({
      ...validPayload(),
      essentials: [essential("nightclub"), essential()],
    });
    expect(r.success).toBe(false);
  });
});
