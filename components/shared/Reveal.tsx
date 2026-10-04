"use client";

import type { ReactNode } from "react";
import { motion, type Transition, type Variants } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;
const RISE_PX = 24;

/**
 * Se dispara un poco antes de que el bloque entre en pantalla (margen inferior positivo)
 * y con poca superficie visible: el contenido nunca queda invisible mientras se lee.
 */
const VIEWPORT = { once: true, amount: 0.15, margin: "0px 0px 12% 0px" } as const;

/** Física amortiguada para el desplazamiento; la opacidad entra con una curva corta. */
const SPRING: Transition = { type: "spring", stiffness: 100, damping: 20 };

function entrance(delay = 0): Transition {
  return { y: { ...SPRING, delay }, opacity: { duration: 0.45, ease: EASE, delay } };
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}

/** Entrada suave (opacidad + desplazamiento) al entrar en pantalla. Sin JS se ve igual (noscript en layout). */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      data-reveal
      className={className}
      initial={{ opacity: 0, y: RISE_PX }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={entrance(delay)}
    >
      {children}
    </Component>
  );
}

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: RISE_PX },
  visible: { opacity: 1, y: 0, transition: entrance() },
};

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}

/** Contenedor que escalona la entrada de sus `RevealItem`. */
export function RevealGroup({ children, className, as = "div" }: RevealGroupProps) {
  const Component = motion[as];
  return (
    <Component className={className} variants={groupVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
      {children}
    </Component>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}

export function RevealItem({ children, className, as = "div" }: RevealItemProps) {
  const Component = motion[as];
  return (
    <Component data-reveal className={className} variants={itemVariants}>
      {children}
    </Component>
  );
}
