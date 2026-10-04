import { site } from "@/data/site";
import type { FAQItem } from "@/types/medical";

type JsonLdObject = Record<string, unknown>;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/**
 * MedicalClinic. No incluye aggregateRating a propósito: Google exige reseñas reales
 * y verificables; agregarlo cuando existan reseñas de pacientes reales.
 */
export function clinicSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${site.url}/#clinic`,
    name: `${site.name} — ${site.legalTagline}`,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    image: `${site.url}/opengraph-image`,
    telephone: site.phone.tel,
    email: site.email,
    slogan: site.slogan,
    medicalSpecialty: ["Rheumatologic", "PhysicalTherapy"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.district,
      addressRegion: site.address.city,
      addressCountry: "PE",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days.map((d) => DAY_NAMES[d]),
        opens: toTime(site.hours.opensAt),
        closes: toTime(site.hours.closesAt),
      },
    ],
    availableService: { "@type": "MedicalTherapy", name: "Teleconsulta" },
    sameAs: site.socials.map((s) => s.href),
  };
}

export function faqSchema(items: readonly FAQItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

interface Crumb {
  label: string;
  href: string;
}

export function breadcrumbSchema(items: readonly Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };
}

interface ProcedureInfo {
  name: string;
  alternateName: readonly string[];
  description: string;
  path: string;
  bodyLocation: string;
  howPerformed: string;
  preparation: string;
  followup: string;
}

/** Procedimiento diagnóstico (p. ej. densitometría ósea) ofrecido por la clínica. */
export function diagnosticProcedureSchema(info: ProcedureInfo): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "DiagnosticProcedure",
    "@id": `${site.url}${info.path}#procedure`,
    name: info.name,
    alternateName: info.alternateName,
    description: info.description,
    url: `${site.url}${info.path}`,
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: info.bodyLocation,
    howPerformed: info.howPerformed,
    preparation: info.preparation,
    followup: info.followup,
    availableAt: { "@id": `${site.url}/#clinic` },
  };
}
