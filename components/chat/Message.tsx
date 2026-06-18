import { cn } from "@/lib/utils";

interface MessageProps {
  role: "user" | "assistant";
  children: React.ReactNode;
}

export function Message({ role, children }: MessageProps) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
