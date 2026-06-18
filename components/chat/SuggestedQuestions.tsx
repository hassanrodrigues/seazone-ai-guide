"use client";

import { Button } from "@/components/ui/button";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const QUESTIONS = [
  "Qual a senha do WiFi?",
  "A que horas é o check-in?",
  "Que restaurantes ficam perto?",
  "Posso trazer pet?",
];

/** Quick-start chips shown before the first message; clicking sends the question. */
export function SuggestedQuestions({
  onSelect,
  disabled,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUESTIONS.map((q) => (
        <Button
          key={q}
          variant="outline"
          size="sm"
          className="h-auto rounded-full py-1.5 text-left whitespace-normal"
          disabled={disabled}
          onClick={() => onSelect(q)}
        >
          {q}
        </Button>
      ))}
    </div>
  );
}
