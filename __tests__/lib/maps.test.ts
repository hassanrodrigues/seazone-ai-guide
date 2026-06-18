import { describe, expect, it } from "vitest";

import { buildMapsUrl, parseDistanceKm, travelModeForDistance } from "@/lib/maps";

const BASE = "https://www.google.com/maps/dir/?";

describe("buildMapsUrl", () => {
  it("builds a walking directions URL", () => {
    const url = buildMapsUrl({
      originAddress: "Rua Lauro Linhares, 589 - Trindade, Florianópolis/SC",
      destinationName: "Box 32",
      destinationCity: "Florianópolis",
    });
    expect(url.startsWith(BASE)).toBe(true);
    const params = new URL(url).searchParams;
    expect(params.get("api")).toBe("1");
    expect(params.get("travelmode")).toBe("walking");
    expect(params.get("destination")).toBe("Box 32 Florianópolis");
  });

  it("builds a driving directions URL when requested", () => {
    const url = buildMapsUrl({
      originAddress: "Rua X, 1",
      destinationName: "Praia Y",
      destinationCity: "Salvador",
      travelMode: "driving",
    });
    expect(new URL(url).searchParams.get("travelmode")).toBe("driving");
  });

  it("encodes accents correctly (round-trips through URLSearchParams)", () => {
    const url = buildMapsUrl({
      originAddress: "Rua das Hortênsias, 220 - Planalto",
      destinationName: "Pão de Açúcar",
      destinationCity: "São Paulo",
    });
    // Raw string must be percent-encoded, not contain the literal accented text.
    expect(url).not.toContain("Pão");
    expect(url).not.toContain("Açúcar");
    // But it decodes back to the original.
    expect(new URL(url).searchParams.get("destination")).toBe(
      "Pão de Açúcar São Paulo",
    );
    expect(new URL(url).searchParams.get("origin")).toBe(
      "Rua das Hortênsias, 220 - Planalto",
    );
  });

  it("encodes ampersands and special characters", () => {
    const url = buildMapsUrl({
      originAddress: "Rua A & B, 10",
      destinationName: "Bar & Grill",
      destinationCity: "Salvador",
    });
    expect(url).toContain("%26"); // literal & never leaks into the query
    expect(new URL(url).searchParams.get("origin")).toBe("Rua A & B, 10");
    expect(new URL(url).searchParams.get("destination")).toBe(
      "Bar & Grill Salvador",
    );
  });

  it("defaults to walking when travelMode is omitted", () => {
    const url = buildMapsUrl({
      originAddress: "Rua X, 1",
      destinationName: "Café",
      destinationCity: "Gramado",
    });
    expect(new URL(url).searchParams.get("travelmode")).toBe("walking");
  });
});

describe("parseDistanceKm", () => {
  it.each([
    ["500 m", 0.5],
    ["1,2 km", 1.2],
    ["Aprox. 1,2 km", 1.2],
    ["2,5 km", 2.5],
  ])("parses %s -> %s km", (input, expected) => {
    expect(parseDistanceKm(input)).toBe(expected);
  });

  it("returns undefined for an absent distance", () => {
    expect(parseDistanceKm(undefined)).toBeUndefined();
  });

  it("returns undefined for an unparseable distance", () => {
    expect(parseDistanceKm("perto")).toBeUndefined();
  });
});

describe("travelModeForDistance", () => {
  it("walks when near, drives when far, walks when unknown", () => {
    expect(travelModeForDistance("1,2 km")).toBe("walking");
    expect(travelModeForDistance("8 km")).toBe("driving");
    expect(travelModeForDistance("5 km")).toBe("driving");
    expect(travelModeForDistance(undefined)).toBe("walking");
  });
});
