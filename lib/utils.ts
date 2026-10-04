import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Las utilidades tipográficas de marca (globals.css) son tamaños de fuente. Sin registrarlas,
 * tailwind-merge las confunde con colores y `cn("text-h2", "text-white")` eliminaba `text-h2`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h2", "h3"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
