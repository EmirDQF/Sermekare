import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { BlogCard } from "@/components/shared/BlogCard";
import { blogPosts } from "@/data/home";

const PREVIEW_COUNT = 3;

export function BlogPreview() {
  const latest = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, PREVIEW_COUNT);

  return (
    <section aria-labelledby="blog-title" className="section-y">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="blog-title"
            align="left"
            eyebrow="Blog de salud articular"
            title="Aprende a cuidar tus articulaciones"
            description="Artículos escritos por nuestros especialistas, en lenguaje claro."
          />
          <Link
            href="/blog"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Ver todos los artículos <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
        </div>

        <RevealGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-3">
          {latest.map((post) => (
            <RevealItem as="li" key={post.slug}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
