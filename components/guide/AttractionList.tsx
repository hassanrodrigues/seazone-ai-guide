import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Attraction } from "@/lib/ai/schemas";

interface AttractionListProps {
  attractions: Attraction[];
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

export function AttractionList({ attractions }: AttractionListProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        O que fazer
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {attractions.map((a) => (
          <Card key={a.name} size="sm" className="h-full">
            <CardContent className="space-y-2">
              <h4 className="leading-snug font-medium">{a.name}</h4>
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
        ))}
      </div>
    </section>
  );
}
