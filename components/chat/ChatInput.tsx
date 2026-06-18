"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_USER_MESSAGE_LENGTH } from "@/lib/constants";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const MAX_HEIGHT = 120;

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    requestAnimationFrame(resize);
  }

  return (
    <div className="flex items-end gap-2 border-t p-3">
      <Textarea
        ref={ref}
        value={value}
        rows={1}
        maxLength={MAX_USER_MESSAGE_LENGTH}
        placeholder="Pergunte algo sobre a estadia…"
        className="max-h-[120px] min-h-9 resize-none"
        onChange={(e) => {
          setValue(e.target.value);
          resize();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <Button
        size="icon"
        onClick={submit}
        disabled={disabled || value.trim().length === 0}
        aria-label="Enviar mensagem"
      >
        <Send />
      </Button>
    </div>
  );
}
