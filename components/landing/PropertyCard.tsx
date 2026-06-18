import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PropertyAddress } from "@/lib/types/property";

interface PropertyCardProps {
  code: string;
  name: string;
  address: PropertyAddress;
  imageUrl?: string;
}

export function PropertyCard({
  code,
  name,
  address,
  imageUrl,
}: PropertyCardProps) {
  return (
    <Link
      href={`/${code}`}
      className="group block rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      aria-label={`Ver guia de ${name}`}
    >
      <Card className="h-full gap-0 py-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-muted">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`Foto de ${name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 340px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <Badge className="absolute top-2 right-2 bg-white/80 text-foreground backdrop-blur-sm">
            {code}
          </Badge>
        </div>

        <CardContent className="space-y-3 p-4">
          <div className="space-y-1">
            <h3 className="leading-snug font-medium">{name}</h3>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {address.neighborhood}, {address.city}/{address.state}
            </p>
          </div>

          {/* Visual affordance only — the whole card is the link, so this is a
              styled span rather than a nested anchor/button. */}
          <span className={cn(buttonVariants({ size: "sm" }), "w-full")}>
            Ver guia
            <ArrowRight aria-hidden />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
