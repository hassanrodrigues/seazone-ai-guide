import { MapPin, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PropertyAddress, PropertyHost } from "@/lib/types/property";

interface ContactSectionProps {
  host: PropertyHost;
  address: PropertyAddress;
}

/** "Ana Paula" -> "AP", "Roberto" -> "R". First letter of the first two words. */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatAddressLine(address: PropertyAddress): string {
  const base = `${address.street}, ${address.number}`;
  return address.complement ? `${base} — ${address.complement}` : base;
}

export function ContactSection({ host, address }: ContactSectionProps) {
  const fullAddress = [
    formatAddressLine(address),
    `${address.neighborhood}, ${address.city}/${address.state}`,
    `CEP ${address.postal_code}`,
  ].join("\n");

  const mapsQuery = encodeURIComponent(
    `${formatAddressLine(address)}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.postal_code}`,
  );

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Contato e endereço
      </h2>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback>{initials(host.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground">Seu anfitrião</p>
                <p className="font-medium">{host.name}</p>
              </div>
            </div>
            <Button asChild size="sm">
              <a href={`tel:${host.phone}`}>
                <Phone aria-hidden />
                Ligar
              </a>
            </Button>
          </div>

          <div className="border-t pt-4">
            <p className="flex items-start gap-2 text-sm whitespace-pre-line text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {fullAddress}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <a
                href={`https://maps.google.com/?q=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin aria-hidden />
                Abrir no Maps
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
