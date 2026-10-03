"use client";

import { motion, type Variants } from "motion/react";

const LEAD_WORDS = ["Recupera", "tu", "movilidad", "y"] as const;
const ACCENT_WORDS = ["vive", "sin", "dolor", "articular"] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.45em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface HeroHeadlineProps {
  id?: string;
}

/** Titular con revelado palabra a palabra (el texto completo queda en el HTML para SEO y lectores de pantalla). */
export function HeroHeadline({ id }: HeroHeadlineProps) {
  return (
    <motion.h1
      id={id}
      className="text-display text-heading"
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label="Recupera tu movilidad y vive sin dolor articular"
    >
      {LEAD_WORDS.map((w) => (
        <motion.span key={w} variants={word} aria-hidden className="mr-[0.24em] inline-block">
          {w}
        </motion.span>
      ))}
      {ACCENT_WORDS.map((w) => (
        <motion.span
          key={w}
          variants={word}
          aria-hidden
          className="mr-[0.24em] inline-block bg-gradient-to-r from-primary to-[#0284c7] bg-clip-text text-transparent last:mr-0 dark:from-teal dark:to-sky-300"
        >
          {w}
        </motion.span>
      ))}
    </motion.h1>
  );
}
