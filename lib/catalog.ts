import { doctors } from "@/data/doctors";
import { blogPosts } from "@/data/home";
import { servicePillars } from "@/data/services";
import { specialties } from "@/data/specialties";
import { treatments } from "@/data/treatments";
import type { BlogPost, Doctor, ServicePillar, Specialty, Treatment } from "@/types/medical";

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

export function findSpecialty(slug: string): Specialty | undefined {
  return specialties.find((specialty) => specialty.slug === slug);
}

export function findDoctor(slug: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.slug === slug);
}

export function findBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
