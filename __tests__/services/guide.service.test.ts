import { beforeEach, describe, expect, it, vi } from "vitest";

import { getOrGenerate } from "@/lib/services/guide.service";
import { AIGenerationError } from "@/lib/errors";
import { flnProperty, sampleGuide } from "../fixtures/property";

// Spies for every collaborator the service touches. vi.hoisted lets the
// vi.mock factories (hoisted above imports) reference them.
const { guideFindUnique, guideUpsert, propertyFindUnique, generateObject, findRealPlaces } =
  vi.hoisted(() => ({
    guideFindUnique: vi.fn(),
    guideUpsert: vi.fn(),
    propertyFindUnique: vi.fn(),
    generateObject: vi.fn(),
    findRealPlaces: vi.fn(),
  }));

vi.mock("@/lib/db", () => ({
  prisma: {
    generatedGuide: { findUnique: guideFindUnique, upsert: guideUpsert },
    property: { findUnique: propertyFindUnique },
  },
}));
vi.mock("ai", () => ({ generateObject }));
vi.mock("@ai-sdk/anthropic", () => ({ anthropic: vi.fn(() => "mock-model") }));
// Places is out of scope here — resolve empty so generation runs ungrounded.
vi.mock("@/lib/services/places.service", () => ({ findRealPlaces }));

beforeEach(() => {
  guideFindUnique.mockReset();
  guideUpsert.mockReset().mockResolvedValue(undefined);
  propertyFindUnique.mockReset().mockResolvedValue(flnProperty);
  generateObject.mockReset();
  findRealPlaces.mockReset().mockResolvedValue([]);
});

describe("guideService.getOrGenerate", () => {
  it("returns the cached guide when one exists for the property", async () => {
    guideFindUnique.mockResolvedValue({ content: sampleGuide });

    const result = await getOrGenerate("FLN001");

    expect(result).toEqual(sampleGuide);
    expect(generateObject).not.toHaveBeenCalled();
    expect(guideUpsert).not.toHaveBeenCalled();
  });

  it("generates and persists a new guide when none exists in cache", async () => {
    guideFindUnique.mockResolvedValue(null);
    generateObject.mockResolvedValue({ object: sampleGuide });

    const result = await getOrGenerate("FLN001");

    expect(result).toEqual(sampleGuide);
    expect(generateObject).toHaveBeenCalledTimes(1);
    expect(guideUpsert).toHaveBeenCalledTimes(1);
    expect(guideUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { propertyCode: "FLN001" },
        create: expect.objectContaining({ content: sampleGuide }),
      }),
    );
  });

  it("throws AIGenerationError when the LLM call fails", async () => {
    guideFindUnique.mockResolvedValue(null);
    generateObject.mockRejectedValue(new Error("model exploded"));

    await expect(getOrGenerate("FLN001")).rejects.toBeInstanceOf(
      AIGenerationError,
    );
    expect(guideUpsert).not.toHaveBeenCalled();
  });

  it("passes the property context to the prompt builder", async () => {
    guideFindUnique.mockResolvedValue(null);
    generateObject.mockResolvedValue({ object: sampleGuide });

    await getOrGenerate("FLN001");

    const callArg = generateObject.mock.calls[0][0];
    expect(callArg.system).toContain("Florianópolis");
    expect(callArg.system).toContain("Trindade");
  });

  it("regenerates when cached content fails schema validation", async () => {
    // Stale/malformed cache row (missing the required arrays).
    guideFindUnique.mockResolvedValue({ content: { welcomeMessage: "stale" } });
    generateObject.mockResolvedValue({ object: sampleGuide });

    const result = await getOrGenerate("FLN001");

    expect(result).toEqual(sampleGuide);
    expect(generateObject).toHaveBeenCalledTimes(1);
  });

  it("persists the regenerated guide, overwriting a schema-invalid cache row", async () => {
    guideFindUnique.mockResolvedValue({ content: { welcomeMessage: "stale" } });
    generateObject.mockResolvedValue({ object: sampleGuide });

    await getOrGenerate("FLN001");

    expect(guideUpsert).toHaveBeenCalledTimes(1);
    expect(guideUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { propertyCode: "FLN001" },
        update: expect.objectContaining({ content: sampleGuide }),
      }),
    );
  });
});
