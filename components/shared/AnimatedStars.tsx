"use client";

import { motion, type Variants } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_STARS = 5;

const row: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } };
const star: Variants = {
  hidden: { opacity: 0.25, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 14 } },
};

interface AnimatedStarsProps {
  rating: number;
  className?: string;
}

/** Calificación cuyas estrellas se encienden una a una al entrar en pantalla. */
export function AnimatedStars({ rating, className }: AnimatedStarsProps) {
  const filled = Math.round(rating);
  return (
    <motion.span
      role="img"
      aria-label={`${rating} de ${MAX_STARS} estrellas`}
      className={cn("inline-flex gap-0.5", className)}
      variants={row}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
    >
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <motion.span key={index} variants={index < filled ? star : undefined} className="inline-flex">
          <Star
            aria-hidden
            strokeWidth={1.5}
            className={cn("size-4", index < filled ? "fill-amber-400 text-amber-500" : "text-line-strong")}
          />
        </motion.span>
      ))}
    </motion.span>
  );
}
