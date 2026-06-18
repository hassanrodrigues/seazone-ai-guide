"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message } from "@/components/chat/Message";
import { MessageList } from "@/components/chat/MessageList";
import { SuggestedQuestions } from "@/components/chat/SuggestedQuestions";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

interface ChatAssistantProps {
  propertyCode: string;
}

const WELCOME =
  "Oi! Sou seu assistente para esta estadia. Posso ajudar com WiFi, check-in, restaurantes próximos, regras da casa, etc. O que gostaria de saber?";

export function ChatAssistant({ propertyCode }: ChatAssistantProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Memoize so the transport (and the code it carries) is stable across renders.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { code: propertyCode },
      }),
    [propertyCode],
  );

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
  });

  const pending = status === "submitted";
  const busy = status === "submitted" || status === "streaming";

  const body = (
    <div className="flex min-h-0 flex-1 flex-col">
      <MessageList
        messages={messages}
        pending={pending}
        topSlot={
          <>
            <Message role="assistant">{WELCOME}</Message>
            {messages.length === 0 && (
              <SuggestedQuestions
                onSelect={(text) => sendMessage({ text })}
                disabled={busy}
              />
            )}
          </>
        }
      />
      {error && (
        <div className="flex items-center justify-between gap-2 border-t bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <span>Algo deu errado. Tente novamente.</span>
          <Button size="sm" variant="ghost" onClick={() => regenerate()}>
            <RefreshCw />
            Repetir
          </Button>
        </div>
      )}
      <ChatInput onSend={(text) => sendMessage({ text })} disabled={busy} />
    </div>
  );

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-lg"
        aria-label="Abrir assistente do imóvel"
      >
        <MessageCircle className="size-5" />
      </Button>

      {isDesktop ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
          >
            <SheetHeader className="border-b">
              <SheetTitle>Assistente do Imóvel</SheetTitle>
            </SheetHeader>
            {body}
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="flex h-[85vh] flex-col">
            <DrawerHeader className="flex flex-row items-center justify-between border-b text-left">
              <DrawerTitle>Assistente do Imóvel</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  Fechar
                </Button>
              </DrawerClose>
            </DrawerHeader>
            {body}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
