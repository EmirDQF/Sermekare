import { servicePillars } from "@/data/services";
import { treatments } from "@/data/treatments";
import type { ServicePillar, Treatment } from "@/types/medical";

/** Búsquedas por slug para las páginas internas (undefined → notFound()). */

export function findPillar(slug: string): ServicePillar | undefined {
  return servicePillars.find((pillar) => pillar.slug === slug);
}

export function findTreatment(slug: string): Treatment | undefined {
  return treatments.find((treatment) => treatment.slug === slug);
}

export function servicePath(slug: string): string {
  return `/servicios/${slug}`;
}

export function treatmentPath(slug: string): string {
  return `/tratamientos/${slug}`;
}
