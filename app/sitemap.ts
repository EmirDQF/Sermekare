import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/** Rutas publicadas. Las páginas internas (fase 3) y el blog (fase 4) se agregan aquí al crearse. */
const ROUTES = [{ path: "/", priority: 1, changeFrequency: "weekly" }] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
