"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useReducedMotionPreference } from "@/lib/motion-preference";

const HEADER_OFFSET_PX = -96;

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Smooth scroll (Lenis) y preferencias de movimiento para toda la app.
 * Respeta prefers-reduced-motion y el interruptor "Reducir animaciones" del footer.
 */
export function Providers({ children }: ProvidersProps) {
  const reduceMotion = useReducedMotionPreference();

  useEffect(() => {
    if (reduceMotion !== false) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      anchors: { offset: HEADER_OFFSET_PX },
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });
    return () => lenis.destroy();
  }, [reduceMotion]);

  return <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>{children}</MotionConfig>;
}
