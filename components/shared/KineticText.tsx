"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";
import { splitKineticWords } from "@/lib/kinetic";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

const VIEWPORT = { once: true, amount: 0.6 } as const;

interface KineticTextProps {
  text: string;
  /** Frase contenida en `text` que se pinta con el gradiente teal animado. */
  accent?: string;
  /** inverted: gradiente claro para fondos navy. */
  tone?: "default" | "inverted";
  className?: string;
}

/**
 * Tipografía cinética: las palabras entran con blur escalonado al aparecer en pantalla.
 * El texto completo queda en el HTML (SEO y lectores de pantalla); sin JS se ve igual (noscript en layout).
 */
export function KineticText({ text, accent, tone = "default", className }: KineticTextProps) {
  const words = splitKineticWords(text, accent);
  const accentClass = tone === "inverted" ? "text-gradient-teal-light" : "text-gradient-teal";

  return (
    <motion.span
      data-kinetic
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {words.map((item, index) => (
        <Fragment key={`${item.word}-${index}`}>
          <motion.span variants={word} className={cn("inline-block", item.accent && accentClass)}>
            {item.word}
          </motion.span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
