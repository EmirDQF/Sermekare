import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TestimonialCard } from "@/components/shared/TestimonialCard";
import { RevealGroup, RevealItem } from "@/components/shared/Reveal";
import { formatStat } from "@/lib/format";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section aria-labelledby="testimonios-title" className="section-y">
      <div className="container-page">
        <SectionHeading
          id="testimonios-title"
          eyebrow="Testimonios"
          title="Pacientes que volvieron a moverse"
          description={
            <span className="inline-flex flex-wrap items-center justify-center gap-2">
              <Star aria-hidden className="size-5 fill-amber-400 text-amber-500" />
              <strong className="font-semibold text-heading">
                {formatStat(site.stats.rating, site.stats.rating.value)} de calificación promedio
              </strong>
              <span>· +{site.stats.reviewsCount} reseñas de pacientes</span>
            </span>
          }
        />
        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <RevealItem key={testimonial.id} className={cn(testimonial.featured && "lg:col-span-2")}>
              <TestimonialCard testimonial={testimonial} />
            </RevealItem>
          ))}
        </RevealGroup>
        <div className="mt-10 text-center">
          <Link
            href="/testimonios"
            className="inline-flex min-h-12 items-center gap-2 font-display font-semibold text-primary hover:underline"
          >
            Leer más testimonios <ArrowRight aria-hidden strokeWidth={1.75} className="size-5" />
          </Link>
          <p className="mt-2 text-sm text-muted">Testimonios publicados con autorización de cada paciente.</p>
        </div>
      </div>
    </section>
  );
}
