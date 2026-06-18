import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Restaurant } from "@/lib/ai/schemas";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Onde comer
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <Card key={r.name} size="sm" className="h-full">
            <CardContent className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="leading-snug font-medium">{r.name}</h4>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {r.priceRange}
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
        ))}
      </div>
    </section>
  );
}
