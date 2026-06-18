import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";

import { Prisma } from "@/app/generated/prisma/client";
import { AI_MODEL, GUIDE_MAX_TOKENS, GUIDE_TEMPERATURE } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { AIGenerationError, PropertyNotFoundError } from "@/lib/errors";
import { buildGuideSystemPrompt } from "@/lib/ai/prompts/guide-generator";
import { ExperienceGuideSchema, type ExperienceGuide } from "@/lib/ai/schemas";
import { findByCode } from "@/lib/services/property.service";

/**
 * Return the local guide for a property, generating and caching it on first
 * request. The challenge requires generated guides to be cached, so a hit
 * returns the stored JSON without calling the model; a miss generates once,
 * persists, and returns.
 *
 * Throws PropertyNotFoundError if the code resolves to no property, and wraps
 * any AI SDK failure in AIGenerationError so callers map it to a single status.
 */
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

  let guide: ExperienceGuide;
  try {
    const { object } = await generateObject({
      model: anthropic(AI_MODEL),
      schema: ExperienceGuideSchema,
      system: buildGuideSystemPrompt(property),
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
