"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";

import { Message } from "@/components/chat/Message";

interface MessageListProps {
  messages: UIMessage[];
  /** True between sending and the first streamed token — shows the typing dots. */
  pending: boolean;
  /** Rendered above the conversation (welcome message + suggested questions). */
  topSlot?: React.ReactNode;
}

/** Treat the user as "at the bottom" within this many px of the end. */
const BOTTOM_THRESHOLD_PX = 50;

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
  // The scrollable viewport itself — owns overflow, so we can read its metrics.
  const viewportRef = useRef<HTMLDivElement>(null);
  // Whether the user is pinned to the bottom. Starts true (initial view) and is
  // updated on every scroll, so it reflects intent right before new content
  // arrives.
  const atBottomRef = useRef(true);

  function handleScroll() {
    const el = viewportRef.current;
    if (!el) return;
    atBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD_PX;
  }

  // Auto-scroll to the newest content ONLY when the user was already at the
  // bottom. If they scrolled up to read history, leave their position alone —
  // even as stream tokens keep mutating `messages`.
  useEffect(() => {
    if (!atBottomRef.current) return;
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  return (
    <div
      ref={viewportRef}
      onScroll={handleScroll}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
    >
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
      </div>
    </div>
  );
}
