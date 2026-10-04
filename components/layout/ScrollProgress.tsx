"use client";

import { motion, useScroll } from "motion/react";

/** Barra fina de progreso de lectura (teal) en el borde superior de la ventana. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[3px] origin-left bg-gradient-to-r from-teal via-teal-300 to-sky-400"
    />
  );
}
