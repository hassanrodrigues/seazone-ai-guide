export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 md:max-w-5xl">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Seazone Guest Guide
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Guias personalizados de hospedagem, gerados por IA pra cada imóvel.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Hoje o{" "}
          <a
            href="https://guia-do-hospede.seazone.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            guia do hóspede da Seazone
          </a>{" "}
          é genérico e idêntico em todos os imóveis. Esta proposta entrega um
          guia único por propriedade — com dados reais da estadia e dicas da
          região geradas por IA.
        </p>
      </section>

      <footer className="mt-16 border-t pt-6 text-center text-xs text-muted-foreground">
        <p>
          Built as a technical challenge for Seazone&apos;s AI Builder position.
        </p>
        <a
          href="https://github.com/hassanrodrigues/seazone-ai-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block underline underline-offset-4 hover:text-foreground"
        >
          github.com/hassanrodrigues/seazone-ai-guide
        </a>
      </footer>
    </main>
  );
}
