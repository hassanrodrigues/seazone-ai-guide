import { Car, KeyRound, Wifi } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/property/CopyButton";
import type { PropertyOperational } from "@/lib/types/property";

interface AccessSectionProps {
  operational: PropertyOperational;
}

// Human-readable PT-BR labels for the access mechanism. Falls back to a generic
// label so an unmapped type never leaks a raw enum string to the guest.
const ACCESS_TYPE_LABELS: Record<string, string> = {
  smart_lock: "Fechadura eletrônica",
  keybox: "Cofre de chaves",
  in_person: "Check-in presencial",
  doorman: "Portaria",
  host_greeting: "Recepção pelo anfitrião",
};

function accessTypeLabel(type: string): string {
  return ACCESS_TYPE_LABELS[type] ?? "Acesso ao imóvel";
}

export function AccessSection({ operational }: AccessSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Acesso e WiFi
      </h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="size-4 text-muted-foreground" aria-hidden />
            WiFi
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Rede: </span>
              <span className="font-medium">{operational.wifi_network}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Senha: </span>
              <span className="font-mono font-medium">
                {operational.wifi_password}
              </span>
            </p>
          </div>
          <CopyButton value={operational.wifi_password} label="Copiar senha" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4 text-muted-foreground" aria-hidden />
            {accessTypeLabel(operational.property_access_type)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {operational.property_access_instructions}
          </p>
        </CardContent>
      </Card>

      {operational.has_parking_spot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="size-4 text-muted-foreground" aria-hidden />
              Estacionamento
            </CardTitle>
            {operational.parking_spot_identifier && (
              <CardDescription>
                {operational.parking_spot_identifier}
              </CardDescription>
            )}
          </CardHeader>
          {operational.parking_spot_instructions && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {operational.parking_spot_instructions}
              </p>
            </CardContent>
          )}
        </Card>
      )}
    </section>
  );
}
