"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import type { TrustStat } from "@/types/medical";
import { formatStat } from "@/lib/format";

const DURATION_S = 1.8;

interface AnimatedCounterProps {
  stat: TrustStat;
  className?: string;
}

/**
 * Número que cuenta desde 0 al entrar en pantalla.
 * El HTML del servidor ya trae el valor final (SEO y sin JS); la animación ocurre solo en el cliente.
 */
export function AnimatedCounter({ stat, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const finalText = formatStat(stat, stat.value);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion || !inView) return;
    const controls = animate(0, stat.value, {
      duration: DURATION_S,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = formatStat(stat, v);
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, stat]);

  return (
    <span className={className}>
      <span className="sr-only">{finalText}</span>
      <span ref={ref} aria-hidden className="tabular-nums">
        {finalText}
      </span>
    </span>
  );
}
