import { ExternalLink, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Restaurant } from "@/lib/ai/schemas";
import { buildMapsUrl, travelModeForDistance } from "@/lib/maps";

interface RestaurantListProps {
  restaurants: Restaurant[];
  originAddress: string;
  city: string;
}

export function RestaurantList({
  restaurants,
  originAddress,
  city,
}: RestaurantListProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Onde comer
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <a
            key={r.name}
            href={buildMapsUrl({
              originAddress,
              destinationName: r.name,
              destinationCity: city,
              travelMode: travelModeForDistance(r.distance),
            })}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir rota até ${r.name} no Google Maps`}
            className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card
              size="sm"
              className="h-full transition-all hover:shadow-md hover:ring-foreground/20"
            >
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="leading-snug font-medium">{r.name}</h4>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="font-mono text-sm text-muted-foreground">
                      {r.priceRange}
                    </span>
                    <ExternalLink
                      className="h-3.5 w-3.5 text-muted-foreground"
                      aria-hidden
                    />
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary">{r.cuisine}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" aria-hidden />
                    {r.distance}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
