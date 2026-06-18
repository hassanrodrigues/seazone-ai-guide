import { beforeEach, describe, expect, it, vi } from "vitest";
import { findByCode } from "@/lib/services/property.service";
import { InvalidPropertyCodeError } from "@/lib/errors";

// Mock the Prisma client so the service is tested in isolation — no DB, and no
// PrismaPg adapter trying to open a connection. vi.hoisted lets the mock factory
// reference the spy (vi.mock is hoisted above imports).
const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));

vi.mock("@/lib/db", () => ({
  prisma: { property: { findUnique } },
}));

beforeEach(() => {
  findUnique.mockReset();
});

describe("findByCode", () => {
  it("normalizes a lowercase code to uppercase before querying", async () => {
    findUnique.mockResolvedValue({ code: "FLN001" });

    const result = await findByCode("fln001");

    expect(findUnique).toHaveBeenCalledWith({ where: { code: "FLN001" } });
    expect(result).toEqual({ code: "FLN001" });
  });

  it("trims surrounding whitespace from the code", async () => {
    findUnique.mockResolvedValue(null);

    await findByCode("  grm001  ");

    expect(findUnique).toHaveBeenCalledWith({ where: { code: "GRM001" } });
  });

  it("returns null when a well-formed code has no matching row", async () => {
    findUnique.mockResolvedValue(null);

    await expect(findByCode("FLN999")).resolves.toBeNull();
  });

  it("throws InvalidPropertyCodeError for a malformed code without querying", async () => {
    await expect(findByCode("not-a-code")).rejects.toBeInstanceOf(
      InvalidPropertyCodeError,
    );
    expect(findUnique).not.toHaveBeenCalled();
  });
});
