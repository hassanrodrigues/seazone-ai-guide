import { z } from "zod";

// Single source of truth for the AI-generated local guide. generateObject
// validates the model output against this schema; the same inferred type is
// reused across the service, API, and UI. Every field is .describe()'d so the
// model knows exactly what each one is for.

export const RestaurantSchema = z.object({
  name: z.string().describe("Nome real do restaurante/bar"),
  cuisine: z.string().describe("Tipo de cozinha, ex: 'Frutos do mar', 'Italiana'"),
  distance: z
    .string()
    .describe('Distância aproximada partindo do imóvel, ex: "Aprox. 1,2 km"'),
  priceRange: z
    .enum(["$", "$$", "$$$"])
    .describe("Faixa de preço: $ econômico, $$ médio, $$$ alto"),
  description: z
    .string()
    .describe("1-2 frases sobre o lugar e o que pedir"),
});

export const AttractionSchema = z.object({
  name: z.string().describe("Nome real da atração/ponto turístico"),
  category: z
    .enum(["praia", "parque", "cultural", "natureza", "mirante", "compras", "outro"])
    .describe("Categoria da atração"),
  distance: z.string().describe('Distância aproximada, ex: "Aprox. 3 km"'),
  description: z.string().describe("1-2 frases sobre a atração"),
});

export const EssentialSchema = z.object({
  name: z.string().describe("Nome real do estabelecimento"),
  type: z
    .enum([
      "pharmacy",
      "supermarket",
      "hospital",
      "bakery",
      "atm",
      "post_office",
    ])
    .describe("Tipo de serviço essencial"),
  distance: z.string().describe('Distância aproximada, ex: "Aprox. 500 m"'),
  description: z.string().describe("Breve nota útil, ex: horário ou diferencial"),
});

export const ExperienceGuideSchema = z.object({
  welcomeMessage: z
    .string()
    .describe(
      "Mensagem de boas-vindas calorosa, 2-3 frases, mencionando algo específico do bairro (não genérico da cidade)",
    ),
  restaurants: z
    .array(RestaurantSchema)
    .min(4)
    .max(5)
    .describe("4 a 5 restaurantes reais próximos, dos melhores avaliados"),
  attractions: z
    .array(AttractionSchema)
    .min(3)
    .max(4)
    .describe("3 a 4 atrações reais próximas"),
  essentials: z
    .array(EssentialSchema)
    .min(3)
    .describe("Pelo menos 3 serviços essenciais reais próximos"),
  seasonalTip: z
    .string()
    .describe(
      "Dica relevante para o mês atual: clima, eventos, alta/baixa temporada na região",
    ),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
export type Attraction = z.infer<typeof AttractionSchema>;
export type Essential = z.infer<typeof EssentialSchema>;
export type ExperienceGuide = z.infer<typeof ExperienceGuideSchema>;
