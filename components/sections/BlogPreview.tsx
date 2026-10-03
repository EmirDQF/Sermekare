import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { blogPosts } from "@/data/home";
import { getDoctor } from "@/data/doctors";

const PREVIEW_COUNT = 3;

const DATE_FORMAT = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

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
          {latest.map((post) => {
            const author = getDoctor(post.authorSlug);
            return (
              <RevealItem as="li" key={post.slug}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-card-solid shadow-soft transition-shadow duration-300 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.cover}
                      alt={post.coverAlt}
                      fill
                      sizes="(min-width: 768px) 33vw, 92vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-semibold text-heading">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-3 text-sm text-muted">
                      <time dateTime={post.publishedAt}>{DATE_FORMAT.format(new Date(post.publishedAt))}</time>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock aria-hidden strokeWidth={1.75} className="size-4" /> {post.readingMinutes} min de lectura
                      </span>
                    </p>
                    <h3 className="text-h3 mt-3">
                      <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:text-primary">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-muted">{post.excerpt}</p>
                    <p className="mt-auto pt-5 text-sm font-medium text-heading">Por {author.name}</p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
