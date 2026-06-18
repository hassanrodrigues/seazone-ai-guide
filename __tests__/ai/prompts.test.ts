import { describe, expect, it } from "vitest";

import { buildGuideSystemPrompt } from "@/lib/ai/prompts/guide-generator";
import { buildChatSystemPrompt } from "@/lib/ai/prompts/chat";
import { flnProperty, grmProperty, sampleGuide } from "../fixtures/property";

const currentMonthPt = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
  new Date(),
);

describe("buildGuideSystemPrompt", () => {
  it("includes the property city and neighborhood in the prompt", () => {
    const prompt = buildGuideSystemPrompt(flnProperty);
    expect(prompt).toContain("Florianópolis");
    expect(prompt).toContain("Trindade");
  });

  it("includes the current month in pt-BR for seasonal context", () => {
    const prompt = buildGuideSystemPrompt(flnProperty);
    expect(prompt).toContain(currentMonthPt);
  });

  it("produces a deterministic prompt for the same property", () => {
    expect(buildGuideSystemPrompt(flnProperty)).toBe(
      buildGuideSystemPrompt(flnProperty),
    );
  });
});

describe("buildChatSystemPrompt", () => {
  it("includes the property full data block when guide is null", () => {
    const prompt = buildChatSystemPrompt(flnProperty, null);
    expect(prompt).toContain("DADOS DO IMÓVEL");
    expect(prompt).toContain(flnProperty.operational.wifi_network);
    expect(prompt).toContain(flnProperty.host.name);
    // No guide → the guide block must be absent.
    expect(prompt).not.toContain("GUIA LOCAL DA REGIÃO");
  });

  it("includes both property and guide blocks when a guide is provided", () => {
    const prompt = buildChatSystemPrompt(flnProperty, sampleGuide);
    expect(prompt).toContain("DADOS DO IMÓVEL");
    expect(prompt).toContain("GUIA LOCAL DA REGIÃO");
    expect(prompt).toContain(sampleGuide.restaurants[0].name);
  });

  it("includes the anti-hallucination strict-citation rule", () => {
    const prompt = buildChatSystemPrompt(flnProperty, sampleGuide);
    expect(prompt).toContain("cite APENAS os nomes exatamente como listados");
  });

  it("reflects the property pet rule from the data (FLN001 disallows pets)", () => {
    expect(buildChatSystemPrompt(flnProperty, null)).toContain(
      "Pets: NÃO permitidos",
    );
    // Cross-check a property that allows pets renders the opposite.
    expect(buildChatSystemPrompt(grmProperty, null)).toContain(
      "Pets: permitidos",
    );
  });
});
