import { NextResponse } from "next/server";

import { PROPERTY_CODE_REGEX } from "@/lib/constants";
import { AIGenerationError, PropertyNotFoundError } from "@/lib/errors";
import { getOrGenerate } from "@/lib/services/guide.service";

// Prisma + the AI SDK require the Node.js runtime (not edge). Generation can
// take longer than the default function budget, so raise the ceiling.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let code: string;
  try {
    const body: unknown = await request.json();
    const raw =
      body && typeof body === "object" && "code" in body
        ? (body as { code: unknown }).code
        : undefined;
    code = typeof raw === "string" ? raw.trim().toUpperCase() : "";
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
    const guide = await getOrGenerate(code);
    return NextResponse.json({ guide });
  } catch (error) {
    if (error instanceof PropertyNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof AIGenerationError) {
      // Log the underlying cause server-side; keep the client message generic.
      console.error("Guide generation failed:", error.cause ?? error);
      return NextResponse.json(
        { error: "Não foi possível gerar o guia agora. Tente novamente." },
        { status: 502 },
      );
    }
    console.error("Unexpected error in /api/generate-guide:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
