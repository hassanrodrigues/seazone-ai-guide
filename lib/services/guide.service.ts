import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";

import { Prisma } from "@/app/generated/prisma/client";
import { AI_MODEL, GUIDE_MAX_TOKENS, GUIDE_TEMPERATURE } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { AIGenerationError, PropertyNotFoundError } from "@/lib/errors";
import {
  buildGuideSystemPrompt,
  type RealPlacesContext,
} from "@/lib/ai/prompts/guide-generator";
import { ExperienceGuideSchema, type ExperienceGuide } from "@/lib/ai/schemas";
import { findByCode } from "@/lib/services/property.service";
import { findRealPlaces } from "@/lib/services/places.service";

/**
 * Return the local guide for a property, generating and caching it on first
 * request. Generated guides are cached to avoid regeneration on revisit, so a
 * hit returns the stored JSON without calling the model; a miss generates once,
 * persists, and returns.
 *
 * Throws PropertyNotFoundError if the code resolves to no property, and wraps
 * any AI SDK failure in AIGenerationError so callers map it to a single status.
 */
/**
 * Fetch real venues to ground generation. Returns undefined (triggering
 * fallback mode) if the Places API is unavailable for any reason — a missing
 * key in local dev, or a transient/permission failure in production. Logs a
 * detailed warning so the degraded mode is visible in the server logs.
 */
async function fetchGrounding(
  code: string,
  address: { neighborhood: string; city: string },
): Promise<RealPlacesContext | undefined> {
  const location = `${address.neighborhood}, ${address.city}`;
  try {
    const [restaurants, attractions, essentials] = await Promise.all([
      findRealPlaces("restaurants", location),
      findRealPlaces("tourist attractions and landmarks", location),
      findRealPlaces("pharmacy supermarket", location),
    ]);
    return { restaurants, attractions, essentials };
  } catch (error) {
    console.warn(
      `[guide] Places API unavailable for ${code}; generating WITHOUT grounding (fallback mode). Reason:`,
      error instanceof Error ? error.message : error,
    );
    return undefined;
  }
}

export async function getOrGenerate(
  propertyCode: string,
): Promise<ExperienceGuide> {
  const code = propertyCode.trim().toUpperCase();

  const cached = await prisma.generatedGuide.findUnique({
    where: { propertyCode: code },
  });
  if (cached) {
    return cached.content as unknown as ExperienceGuide;
  }

  // findByCode normalizes + validates the code and returns null when missing.
  const property = await findByCode(code);
  if (!property) {
    throw new PropertyNotFoundError(code);
  }

  // Ground generation in real venues (RAG). If the Places API is unavailable,
  // fall back to ungrounded generation under the strengthened prompt — the
  // guide still generates, just without the real-place allowlist.
  const places = await fetchGrounding(code, property.address);

  let guide: ExperienceGuide;
  try {
    const { object } = await generateObject({
      model: anthropic(AI_MODEL),
      schema: ExperienceGuideSchema,
      system: buildGuideSystemPrompt(property, places),
      prompt:
        "Gere o guia de experiências local para este imóvel, seguindo rigorosamente as regras do sistema.",
      temperature: GUIDE_TEMPERATURE,
      maxOutputTokens: GUIDE_MAX_TOKENS,
    });
    guide = object;
  } catch (error) {
    throw new AIGenerationError(
      `Não foi possível gerar o guia para o imóvel ${code}.`,
      { cause: error },
    );
  }

  await prisma.generatedGuide.upsert({
    where: { propertyCode: code },
    create: {
      propertyCode: code,
      content: guide as unknown as Prisma.InputJsonValue,
      model: AI_MODEL,
    },
    update: {
      content: guide as unknown as Prisma.InputJsonValue,
      model: AI_MODEL,
    },
  });

  return guide;
}
