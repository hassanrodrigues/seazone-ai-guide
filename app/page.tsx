import { PropertyCard } from "@/components/landing/PropertyCard";
import { listProperties } from "@/lib/services/property.service";

export default async function Home() {
  const properties = await listProperties();

  return (
    <main>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:max-w-5xl lg:max-w-6xl">
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

      <section className="mt-12">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Imóveis disponíveis
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.code}
              code={property.code}
              name={property.name}
              address={property.address}
              imageUrl={property.images[0]}
            />
          ))}
        </div>
      </section>
      </div>

      <footer className="mt-16 bg-navy py-12 text-white">
        <div className="mx-auto w-full max-w-2xl px-4 text-center text-xs text-white/70 md:max-w-5xl lg:max-w-6xl">
          <p>
            Demonstração de guia digital personalizado por imóvel, gerado por
            IA.
          </p>
          <a
            href="https://github.com/hassanrodrigues/seazone-ai-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-white/90 underline underline-offset-4 hover:text-white"
          >
            github.com/hassanrodrigues/seazone-ai-guide
          </a>
        </div>
      </footer>
    </main>
  );
}
