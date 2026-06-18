import { Quote } from "lucide-react";

interface WelcomeMessageProps {
  message: string;
}

export function WelcomeMessage({ message }: WelcomeMessageProps) {
  return (
    <div className="rounded-xl bg-muted/60 p-5">
      <Quote className="size-5 text-muted-foreground/70" aria-hidden />
      <p className="mt-2 text-base leading-relaxed text-foreground/90 italic">
        {message}
      </p>
    </div>
  );
}
