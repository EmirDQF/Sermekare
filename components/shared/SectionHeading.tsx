import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** id del h2, para enlazarlo con aria-labelledby en la sección. */
  id?: string;
  tone?: "default" | "inverted";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  id,
  tone = "default",
  className,
}: SectionHeadingProps) {
  const inverted = tone === "inverted";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold tracking-wide",
          inverted ? "bg-white/10 text-teal-200" : "bg-teal-tint text-primary",
        )}
      >
        <span aria-hidden className={cn("size-1.5 rounded-full", inverted ? "bg-teal-300" : "bg-teal")} />
        {eyebrow}
      </p>
      <h2 id={id} className={cn("text-h2 mt-4", inverted && "text-white")}>
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-lg", inverted ? "text-slate-200" : "text-muted")}>{description}</p>
      ) : null}
    </div>
  );
}
