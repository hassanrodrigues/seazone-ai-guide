import Link from "next/link";
import { Home, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <SearchX className="size-12 text-muted-foreground" aria-hidden />
      <h1 className="text-2xl font-semibold tracking-tight">
        Imóvel não encontrado
      </h1>
      <p className="text-muted-foreground">
        Não encontramos nenhum imóvel com esse código. Confira se digitou
        corretamente — o código tem o formato de três letras e três números,
        como <span className="font-medium text-foreground">FLN001</span>.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">
          <Home aria-hidden />
          Voltar ao início
        </Link>
      </Button>
    </main>
  );
}
