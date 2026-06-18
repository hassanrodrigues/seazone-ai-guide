"use client";

import { useEffect, useState } from "react";

/**
 * Track a CSS media query. Returns false during SSR / first paint (so the
 * mobile layout is the default), then corrects after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}
