"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

const HEADER_OFFSET_PX = -96;

interface ProvidersProps {
  children: ReactNode;
}

/** Smooth scroll (Lenis) y preferencias de movimiento para toda la app. */
export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      anchors: { offset: HEADER_OFFSET_PX },
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });
    return () => lenis.destroy();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
