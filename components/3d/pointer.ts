"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface PointerState {
  /** Posición normalizada del mouse en la ventana (-1..1, Y hacia abajo). */
  x: number;
  y: number;
  /** Recorrido acumulado del mouse en diagonales de ventana (mide la interacción). */
  travel: number;
}

/**
 * Sigue el mouse en toda la ventana sin provocar renders (las escenas lo leen en useFrame).
 * Ignora toques y lápices: en pantallas táctiles las escenas reaccionan al scroll.
 */
export function useWindowPointer(enabled: boolean): RefObject<PointerState> {
  const state = useRef<PointerState>({ x: 0, y: 0, travel: 0 });

  useEffect(() => {
    if (!enabled) return;
    let last: { x: number; y: number } | null = null;
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pointer = state.current;
      pointer.x = (event.clientX / width) * 2 - 1;
      pointer.y = (event.clientY / height) * 2 - 1;
      if (last) pointer.travel += Math.hypot(event.clientX - last.x, event.clientY - last.y) / Math.hypot(width, height);
      last = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [enabled]);

  return state;
}
