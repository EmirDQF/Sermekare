"use client";

import dynamic from "next/dynamic";
import { useCanvasStatus } from "@/components/3d/hooks";

/** three, R3F y drei viajan en este chunk diferido: no tocan el JS inicial. */
const CanvasRoot = dynamic(() => import("@/components/3d/CanvasRoot"), { ssr: false });

/**
 * Monta el lienzo WebGL global solo cuando algún Scene3DSlot lo pide
 * (página cargada + escena cerca de la pantalla). Si WebGL falla, lo desmonta.
 */
export function CanvasHost() {
  const { status } = useCanvasStatus();
  if (status === "idle" || status === "failed") return null;
  return <CanvasRoot />;
}
