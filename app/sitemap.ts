import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { servicePillars } from "@/data/services";
import { treatments } from "@/data/treatments";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

interface Route {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}

/** Rutas publicadas. Las demás páginas internas y el blog se agregan aquí al crearse. */
const ROUTES: readonly Route[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/densitometria-osea", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios", priority: 0.8, changeFrequency: "monthly" },
  ...servicePillars.map((pillar) => ({ path: `/servicios/${pillar.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
  { path: "/tratamientos", priority: 0.8, changeFrequency: "monthly" },
  ...treatments.map((treatment) => ({ path: `/tratamientos/${treatment.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
