import { ExternalLink, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Attraction } from "@/lib/ai/schemas";
import { buildMapsUrl, travelModeForDistance } from "@/lib/maps";

interface AttractionListProps {
  attractions: Attraction[];
  originAddress: string;
  city: string;
}

// PT-BR labels for the attraction categories defined in the schema.
const CATEGORY_LABELS: Record<Attraction["category"], string> = {
  praia: "Praia",
  parque: "Parque",
  cultural: "Cultural",
  natureza: "Natureza",
  mirante: "Mirante",
  compras: "Compras",
  outro: "Outro",
};

export function AttractionList({
  attractions,
  originAddress,
  city,
}: AttractionListProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        O que fazer
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {attractions.map((a) => (
          <a
            key={a.name}
            href={buildMapsUrl({
              originAddress,
              destinationName: a.name,
              destinationCity: city,
              travelMode: travelModeForDistance(a.distance),
            })}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir rota até ${a.name} no Google Maps`}
            className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card
              size="sm"
              className="h-full transition-all hover:shadow-md hover:ring-foreground/20"
            >
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="leading-snug font-medium">{a.name}</h4>
                  <ExternalLink
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge className="bg-accent text-accent-foreground">
                    {CATEGORY_LABELS[a.category]}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" aria-hidden />
                    {a.distance}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{a.description}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
