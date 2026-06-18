import {
  ArrowUp,
  ChefHat,
  Flame,
  Mountain,
  Snowflake,
  Sparkles,
  Tv,
  WashingMachine,
  Waves,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { PropertyAmenities } from "@/lib/types/property";

interface AmenitiesGridProps {
  amenities: PropertyAmenities;
}

// Ordered map from amenity flag to its icon + PT-BR label. Order here is the
// display order; only flags set to true are rendered.
const AMENITY_META: { key: keyof PropertyAmenities; icon: LucideIcon; label: string }[] = [
  { key: "wifi", icon: Wifi, label: "WiFi" },
  { key: "tv", icon: Tv, label: "TV" },
  { key: "air_conditioning", icon: Snowflake, label: "Ar-condicionado" },
  { key: "kitchen", icon: ChefHat, label: "Cozinha" },
  { key: "washing_machine", icon: WashingMachine, label: "Lavadora" },
  { key: "dishwasher", icon: Sparkles, label: "Lava-louças" },
  { key: "elevator", icon: ArrowUp, label: "Elevador" },
  { key: "balcony", icon: Mountain, label: "Varanda" },
  { key: "bbq_grill", icon: Flame, label: "Churrasqueira" },
  { key: "pool", icon: Waves, label: "Piscina" },
];

export function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  const available = AMENITY_META.filter(({ key }) => amenities[key]);

  if (available.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Comodidades
      </h2>

      <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
        {available.map(({ key, icon: Icon, label }) => (
          <Card key={key} size="sm">
            <CardContent className="flex flex-col items-center gap-1.5 text-center">
              <Icon className="size-5 text-muted-foreground" aria-hidden />
              <span className="text-xs font-medium">{label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
