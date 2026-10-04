import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getDoctor } from "@/data/doctors";
import { formatLongDate } from "@/lib/format";
import type { BlogPost } from "@/types/medical";

interface BlogCardProps {
  post: BlogPost;
  /** Nivel del título según la página (h2 en el índice del blog, h3 dentro de una sección). */
  headingLevel?: "h2" | "h3";
}

/** Tarjeta de artículo: portada, categoría, fecha, lectura, título (enlace de toda la tarjeta) y autor. */
export function BlogCard({ post, headingLevel = "h3" }: BlogCardProps) {
  const author = getDoctor(post.authorSlug);
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-card-solid shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.cover}
          alt={post.coverAlt}
          fill
          sizes="(min-width: 768px) 33vw, 92vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-semibold text-heading">{post.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-3 text-sm text-muted">
          <time dateTime={post.publishedAt}>{formatLongDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden strokeWidth={1.75} className="size-4" /> {post.readingMinutes} min de lectura
          </span>
        </p>
        <Heading className="text-h3 mt-3">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:text-primary">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 text-muted">{post.excerpt}</p>
        <p className="mt-auto pt-5 text-sm font-medium text-heading">Por {author.name}</p>
      </div>
    </article>
  );
}
