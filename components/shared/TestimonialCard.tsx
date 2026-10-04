import { Quote } from "lucide-react";
import type { Testimonial } from "@/types/medical";
import { AnimatedStars } from "@/components/shared/AnimatedStars";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const featured = testimonial.featured === true;
  return (
    <figure
      className={cn(
        "relative flex h-full flex-col rounded-[1.75rem] border border-line bg-card-solid p-6 shadow-soft sm:p-7",
        featured && "gradient-border",
        className,
      )}
    >
      <Quote aria-hidden strokeWidth={1.5} className="absolute right-6 top-6 size-10 text-teal/25" />
      <AnimatedStars rating={testimonial.rating} />
      <p className="mt-3 inline-flex w-fit rounded-full bg-teal-tint px-3 py-1 text-sm font-semibold text-primary">
        {testimonial.condition}
      </p>
      <blockquote className={cn("mt-4 text-fg", featured ? "text-lg leading-relaxed sm:text-xl" : "")}>
        <p>“{testimonial.quote}”</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-6">
        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-full bg-navy font-display font-bold text-white dark:bg-teal dark:text-navy"
        >
          {testimonial.initials}
        </span>
        <span>
          <span className="block font-display font-semibold text-heading">
            {testimonial.name}, {testimonial.age} años
          </span>
          <span className="block text-sm text-muted">{testimonial.treatmentTime}</span>
        </span>
      </figcaption>
    </figure>
  );
}
