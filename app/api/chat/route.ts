import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { NextResponse } from "next/server";

import { buildChatSystemPrompt } from "@/lib/ai/prompts/chat";
import {
  AI_MODEL,
  CHAT_MAX_TOKENS,
  CHAT_TEMPERATURE,
  PROPERTY_CODE_REGEX,
} from "@/lib/constants";
import type { ExperienceGuide } from "@/lib/ai/schemas";
import { getOrGenerate } from "@/lib/services/guide.service";
import { findByCode } from "@/lib/services/property.service";

// Prisma + Anthropic need the Node.js runtime; a first-time guide generation
// can be slow, so raise the budget.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let code: string;
  let messages: UIMessage[];
  try {
    const body: unknown = await request.json();
    const obj = (body ?? {}) as { code?: unknown; messages?: unknown };
    code = typeof obj.code === "string" ? obj.code.trim().toUpperCase() : "";
    messages = Array.isArray(obj.messages) ? (obj.messages as UIMessage[]) : [];
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 },
    );
  }

  if (!PROPERTY_CODE_REGEX.test(code)) {
    return NextResponse.json(
      { error: "Código de imóvel inválido." },
      { status: 400 },
    );
  }

  try {
    const property = await findByCode(code);
    if (!property) {
      return NextResponse.json(
        { error: "Imóvel não encontrado." },
        { status: 404 },
      );
    }

    // The guide enriches answers about the region but isn't required — if it
    // can't be produced, the assistant still works from the property data.
    let guide: ExperienceGuide | null = null;
    try {
      guide = await getOrGenerate(code);
    } catch (error) {
      console.warn(
        `[chat] guide unavailable for ${code}; answering from property data only.`,
        error instanceof Error ? error.message : error,
      );
    }

    const result = streamText({
      model: anthropic(AI_MODEL),
      system: buildChatSystemPrompt(property, guide),
      messages: await convertToModelMessages(messages),
      temperature: CHAT_TEMPERATURE,
      maxOutputTokens: CHAT_MAX_TOKENS,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Unexpected error in /api/chat:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
