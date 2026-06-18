import {
  Banknote,
  Croissant,
  Cross,
  ExternalLink,
  Mail,
  Pill,
  ShoppingCart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Essential } from "@/lib/ai/schemas";
import { buildMapsUrl } from "@/lib/maps";

interface EssentialsListProps {
  essentials: Essential[];
  originAddress: string;
  city: string;
}

const TYPE_ICONS: Record<Essential["type"], LucideIcon> = {
  pharmacy: Pill,
  supermarket: ShoppingCart,
  hospital: Cross,
  bakery: Croissant,
  atm: Banknote,
  post_office: Mail,
};

export function EssentialsList({
  essentials,
  originAddress,
  city,
}: EssentialsListProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Serviços essenciais
      </h3>
      <Card size="sm">
        <CardContent className="divide-y divide-border p-0">
          {essentials.map((e) => {
            const Icon = TYPE_ICONS[e.type];
            return (
              <a
                key={e.name}
                href={buildMapsUrl({
                  originAddress,
                  destinationName: e.name,
                  destinationCity: city,
                  // Essentials are nearby by definition, and many lack a usable
                  // distance — always route on foot.
                  travelMode: "walking",
                })}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir rota até ${e.name} no Google Maps`}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <Icon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {e.name}
                    <span className="ml-2 font-normal text-muted-foreground">
                      {e.distance}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {e.description}
                  </p>
                </div>
                <ExternalLink
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </a>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
