import { prisma } from "@/lib/db";
import { PROPERTY_CODE_REGEX } from "@/lib/constants";
import { InvalidPropertyCodeError } from "@/lib/errors";
import type { TypedProperty } from "@/lib/types/property";

/**
 * Look up a property by its code.
 *
 * Codes are normalized to uppercase first, so "/fln001" and "/FLN001" resolve
 * to the same property. A code that doesn't match the expected format throws
 * InvalidPropertyCodeError (a client mistake, distinct from "not found"); a
 * well-formed code with no matching row returns null so the caller decides how
 * to respond — typically notFound() at the route level.
 */
export async function findByCode(code: string): Promise<TypedProperty | null> {
  const normalized = code.trim().toUpperCase();

  if (!PROPERTY_CODE_REGEX.test(normalized)) {
    throw new InvalidPropertyCodeError(code);
  }

  const property = await prisma.property.findUnique({
    where: { code: normalized },
  });

  // Prisma types the Json columns as JsonValue; the seed writes the shapes
  // declared in lib/types/property.ts, so we narrow to TypedProperty here.
  return property as TypedProperty | null;
}
