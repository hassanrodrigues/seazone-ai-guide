"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/components/chat/Message";

interface MessageListProps {
  messages: UIMessage[];
  /** True between sending and the first streamed token — shows the typing dots. */
  pending: boolean;
  /** Rendered above the conversation (welcome message + suggested questions). */
  topSlot?: React.ReactNode;
}

/** Concatenate the text parts of a v6 UIMessage. */
function messageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function MessageList({ messages, pending, topSlot }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-3 p-4">
        {topSlot}
        {messages.map(
          (m) =>
            (m.role === "user" || m.role === "assistant") && (
              <Message key={m.id} role={m.role}>
                {messageText(m)}
              </Message>
            ),
        )}
        {pending && <TypingIndicator />}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
