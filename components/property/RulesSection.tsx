import { Baby, Check, Cigarette, PartyPopper, PawPrint, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { PropertyRules } from "@/lib/types/property";

interface RulesSectionProps {
  rules: PropertyRules;
}

interface RuleItem {
  icon: LucideIcon;
  label: string;
  allowed: boolean;
  yes: string;
  no: string;
}

export function RulesSection({ rules }: RulesSectionProps) {
  const items: RuleItem[] = [
    {
      icon: Baby,
      label: "Crianças",
      allowed: rules.suitable_for_children,
      yes: "Bem-vindas",
      no: "Não recomendado",
    },
    {
      icon: PawPrint,
      label: "Pets",
      allowed: rules.allow_pet,
      yes: "Permitidos",
      no: "Não permitidos",
    },
    {
      icon: Cigarette,
      label: "Fumantes",
      allowed: rules.smoking_permitted,
      yes: "Permitido",
      no: "Não permitido",
    },
    {
      icon: PartyPopper,
      label: "Festas",
      allowed: rules.events_permitted,
      yes: "Permitidas",
      no: "Não permitidas",
    },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Regras da estadia
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, allowed, yes, no }) => (
          <Card key={label} size="sm">
            <CardContent className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4 text-muted-foreground" aria-hidden />
                {label}
              </span>
              <Badge
                className={
                  allowed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {allowed ? <Check aria-hidden /> : <X aria-hidden />}
                {allowed ? yes : no}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
