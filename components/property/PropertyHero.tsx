import Image from "next/image";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PropertyAddress } from "@/lib/types/property";

interface PropertyHeroProps {
  name: string;
  address: PropertyAddress;
  imageUrl?: string;
}

export function PropertyHero({ name, address, imageUrl }: PropertyHeroProps) {
  return (
    <section className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl md:aspect-[21/9]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Foto de ${name}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}

      {/* Darken the bottom so the white text stays legible over any photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />

      <Badge className="absolute top-4 left-4 bg-white/90 text-foreground backdrop-blur-sm">
        Bem-vindo à sua estadia
      </Badge>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {name}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90 md:text-base">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {address.neighborhood}, {address.city}/{address.state}
        </p>
      </div>
    </section>
  );
}
