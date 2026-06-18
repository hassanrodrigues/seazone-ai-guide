"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AttractionList } from "@/components/guide/AttractionList";
import { EssentialsList } from "@/components/guide/EssentialsList";
import { GuideSkeleton } from "@/components/guide/GuideSkeleton";
import { RestaurantList } from "@/components/guide/RestaurantList";
import { SeasonalTip } from "@/components/guide/SeasonalTip";
import { WelcomeMessage } from "@/components/guide/WelcomeMessage";
import type { ExperienceGuide as ExperienceGuideData } from "@/lib/ai/schemas";

interface ExperienceGuideProps {
  propertyCode: string;
}

type Status = "loading" | "error" | "success";

export function ExperienceGuide({ propertyCode }: ExperienceGuideProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [guide, setGuide] = useState<ExperienceGuideData | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/generate-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: propertyCode }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data: { guide: ExperienceGuideData } = await res.json();
      setGuide(data.guide);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [propertyCode]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-2">
        <Sparkles className="size-5 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold tracking-tight">
          Guia da região
        </h2>
        <Badge variant="secondary" className="ml-auto">
          Gerado por IA
        </Badge>
      </header>

      {status === "loading" && <GuideSkeleton />}

      {status === "error" && (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar o guia da região agora.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={load}
          >
            <RefreshCw aria-hidden />
            Tentar novamente
          </Button>
        </div>
      )}

      {status === "success" && guide && (
        <div className="space-y-6">
          <WelcomeMessage message={guide.welcomeMessage} />
          <RestaurantList restaurants={guide.restaurants} />
          <AttractionList attractions={guide.attractions} />
          <EssentialsList essentials={guide.essentials} />
          <SeasonalTip tip={guide.seasonalTip} />
        </div>
      )}
    </section>
  );
}
