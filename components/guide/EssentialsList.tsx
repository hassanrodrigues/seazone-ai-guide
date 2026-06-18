import {
  Banknote,
  Croissant,
  Cross,
  Mail,
  Pill,
  ShoppingCart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Essential } from "@/lib/ai/schemas";

interface EssentialsListProps {
  essentials: Essential[];
}

const TYPE_ICONS: Record<Essential["type"], LucideIcon> = {
  pharmacy: Pill,
  supermarket: ShoppingCart,
  hospital: Cross,
  bakery: Croissant,
  atm: Banknote,
  post_office: Mail,
};

export function EssentialsList({ essentials }: EssentialsListProps) {
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
              <div key={e.name} className="flex items-start gap-3 px-4 py-3">
                <Icon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <div className="min-w-0">
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
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
