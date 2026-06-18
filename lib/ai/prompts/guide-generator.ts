import type { RealPlace } from "@/lib/types/places";
import type { TypedProperty } from "@/lib/types/property";

/** Real places fetched from the Places API to ground generation, by category. */
export interface RealPlacesContext {
  restaurants?: RealPlace[];
  attractions?: RealPlace[];
  essentials?: RealPlace[];
}

/** Current month in Portuguese, computed at request time (e.g. "junho"). */
function currentMonthPt(): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());
}

// Google's priceLevel enum -> a compact $ label for the prompt.
const PRICE_LABELS: Record<string, string> = {
  PRICE_LEVEL_FREE: "grátis",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

/** Format a place list as prompt lines: "- Nome | Endereço | ⭐ 4.5 (320 reviews) | $$". */
function formatPlaces(places: RealPlace[]): string {
  return places
    .map((p) => {
      const rating =
        p.rating != null
          ? `⭐ ${p.rating} (${p.ratingCount ?? 0} reviews)`
          : "sem avaliação";
      const price = p.priceLevel ? ` | ${PRICE_LABELS[p.priceLevel] ?? ""}` : "";
      return `- ${p.name} | ${p.address} | ${rating}${price}`;
    })
    .join("\n");
}

function hasGrounding(places?: RealPlacesContext): boolean {
  if (!places) return false;
  return Boolean(
    places.restaurants?.length ||
      places.attractions?.length ||
      places.essentials?.length,
  );
}

/**
 * Build the system prompt for guide generation.
 *
 * Two modes:
 * - RAG (grounded): when real places are supplied, the model MUST select only
 *   from the provided lists — fabrication is structurally impossible.
 * - Fallback: when no places are supplied (Places API absent/failed), the model
 *   relies on parametric knowledge under strengthened anti-hallucination rules.
 *
 * Versioned as code (see docs/PLANNING.md §2) so prompt changes are reviewable.
 */
export function buildGuideSystemPrompt(
  property: TypedProperty,
  places?: RealPlacesContext,
): string {
  const { name, propertyType, guestCapacity, address, rules } = property;
  const { street, number, neighborhood, city, state } = address;

  const intro = `Você é um guia local especialista em ${city}/${state}, com profundo conhecimento da região e do bairro ${neighborhood}.

Sua tarefa é criar um guia de experiências personalizado para um hóspede que está se hospedando em "${name}", localizado em:
${street}, ${number} - ${neighborhood}, ${city}/${state}`;

  const sourcingBlock = hasGrounding(places)
    ? `LUGARES REAIS DISPONÍVEIS (DADOS DO GOOGLE PLACES) — ESCOLHA APENAS DESTES:

RESTAURANTES PRÓXIMOS:
${formatPlaces(places?.restaurants ?? [])}

ATRAÇÕES E LANDMARKS:
${formatPlaces(places?.attractions ?? [])}

ESSENCIAIS (FARMÁCIAS, SUPERMERCADOS):
${formatPlaces(places?.essentials ?? [])}

REGRA CRÍTICA — GROUNDING:
- Você DEVE escolher APENAS dos lugares listados acima. NÃO invente nomes nem inclua lugares fora dessas listas.
- Selecione com base no rating, na proximidade implícita pelo endereço e na adequação ao perfil do hóspede.
- Use o NOME exatamente como aparece na lista. Escreva as descrições, estime distâncias a partir de ${neighborhood} e classifique as categorias você mesmo.
- Se uma lista tiver poucos itens, retorne menos — nunca complete com invenções.`
    : `REGRA CRÍTICA — ANTI-HALUCINAÇÃO:
- Sugira APENAS lugares estabelecidos, com reviews online verificáveis.
- Prefira ÂNCORAS conhecidas da região (museus, parques famosos, restaurantes premiados, ruas turísticas) em detrimento de lugares "locais genéricos".
- NUNCA invente nomes que SOEM brasileiros mas que você não tem certeza absoluta que existem. Exemplos do que NÃO fazer: "Birosca do Zé", "Barraca do Coco", "Hamburgueria do Bairro", "Cantina do Délio" (se você não tem 95%+ certeza que existe NA CIDADE específica).
- Se você não tem certeza sobre um lugar específico naquela CIDADE, NÃO inclua. Prefira retornar 4 restaurantes verificáveis a 5 com risco de invenção.
- VERIFICA mentalmente: o lugar existe NESSA cidade exata? Cuidado com cadeias ou nomes que existem em outras cidades — não os atribua a localizações erradas (ex: ${city} ≠ outra cidade com nome parecido).`;

  const generalRules = `OUTRAS REGRAS:
1. Distâncias devem ser REALISTAS partindo de ${neighborhood}.
2. Priorize lugares acessíveis (até 5 km) e bem avaliados.
3. Mês atual: ${currentMonthPt()}. Considere temperatura, chuvas e eventos típicos dessa época em ${city} na dica sazonal.
4. Tom: acolhedor, brasileiro, conciso. Como se fosse um amigo morador local.
5. NÃO use emojis nas descrições.
6. Mensagem de boas-vindas: 2-3 frases, mencione algo específico do bairro ${neighborhood} (não genérico de ${city}).`;

  const propertyContext = `CONTEXTO ADICIONAL DO IMÓVEL:
- Tipo: ${propertyType}
- Capacidade: ${guestCapacity} hóspedes
- Pet-friendly: ${rules.allow_pet ? "sim" : "não"}
- Família com crianças: ${rules.suitable_for_children ? "adequado" : "limitado"}

Use essas características pra calibrar as sugestões (ex: se permite pet, mencione locais pet-friendly; se família, prefira opções familiares).`;

  return [intro, sourcingBlock, generalRules, propertyContext].join("\n\n");
}
