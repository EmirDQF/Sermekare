import type { Metadata } from "next";
import { site } from "@/data/site";

interface PageSeo {
  title: string;
  description: string;
  path?: string;
}

/** Metadata consistente por página (canonical, Open Graph y Twitter). */
export function buildMetadata({ title, description, path = "/" }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      locale: "es_PE",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const DEFAULT_DESCRIPTION =
  "Reumatólogos certificados en San Borja, Lima. Diagnóstico oportuno de artrosis, artritis reumatoide, gota, lupus y osteoporosis, infiltraciones ecoguiadas y teleconsulta. Agenda por WhatsApp.";
