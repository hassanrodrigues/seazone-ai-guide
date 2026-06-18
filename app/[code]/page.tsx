import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { ExperienceGuide } from "@/components/guide/ExperienceGuide";
import { GuideSkeleton } from "@/components/guide/GuideSkeleton";
import { AccessSection } from "@/components/property/AccessSection";
import { AmenitiesGrid } from "@/components/property/AmenitiesGrid";
import { ContactSection } from "@/components/property/ContactSection";
import { PropertyHero } from "@/components/property/PropertyHero";
import { QuickInfoCards } from "@/components/property/QuickInfoCards";
import { RulesSection } from "@/components/property/RulesSection";
import { InvalidPropertyCodeError } from "@/lib/errors";
import { findByCode } from "@/lib/services/property.service";

interface PropertyPageProps {
  params: Promise<{ code: string }>;
}

// Cached so generateMetadata and the page share a single DB query per request.
// A malformed code is treated like "not found" at the route level — the page
// renders the friendly 404 rather than surfacing a validation error.
const getProperty = cache(async (code: string) => {
  try {
    return await findByCode(code);
  } catch (error) {
    if (error instanceof InvalidPropertyCodeError) return null;
    throw error;
  }
});

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { code } = await params;
  const property = await getProperty(code);

  if (!property) {
    return { title: "Imóvel não encontrado — Seazone" };
  }

  return {
    title: `${property.name} — Seazone`,
    description: `Guia da sua estadia em ${property.address.neighborhood}, ${property.address.city}/${property.address.state}.`,
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { code } = await params;
  const property = await getProperty(code);

  if (!property) {
    notFound();
  }

  return (
    <>
    <main className="mx-auto w-full max-w-2xl space-y-8 px-4 py-6 md:max-w-4xl md:py-10">
      <PropertyHero
        name={property.name}
        address={property.address}
        imageUrl={property.images[0]}
      />
      <QuickInfoCards
        checkInTime={property.rules.check_in_time}
        checkOutTime={property.rules.check_out_time}
        guestCapacity={property.guestCapacity}
      />
      <AccessSection operational={property.operational} />
      <RulesSection rules={property.rules} />
      <AmenitiesGrid amenities={property.amenities} />
      <Suspense fallback={<GuideSkeleton />}>
        <ExperienceGuide propertyCode={property.code} />
      </Suspense>
      <ContactSection host={property.host} address={property.address} />
    </main>
    <ChatAssistant propertyCode={property.code} />
    </>
  );
}
