import { Sun } from "lucide-react";

interface SeasonalTipProps {
  tip: string;
}

export function SeasonalTip({ tip }: SeasonalTipProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Dica da estação
      </h3>
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <Sun
          className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">
          {tip}
        </p>
      </div>
    </section>
  );
}
