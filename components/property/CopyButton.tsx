"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  value: string;
  label?: string;
}

/**
 * Copies a value to the clipboard and briefly confirms. Client-only because
 * the Clipboard API and the "copied" state need the browser — it's the single
 * interactive island inside the otherwise-static AccessSection.
 */
export function CopyButton({ value, label = "Copiar" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for older mobile browsers / non-secure contexts where the
      // Clipboard API is unavailable.
      const el = document.createElement("textarea");
      el.value = value;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={copy}
      aria-label={`${label}: ${value}`}
    >
      {copied ? (
        <>
          <Check aria-hidden /> Copiado
        </>
      ) : (
        <>
          <Copy aria-hidden /> {label}
        </>
      )}
    </Button>
  );
}
