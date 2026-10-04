import type { BodyZoneId, BoneDensityLevel } from "@/types/medical";
import type { MicroVariant } from "@/lib/micro-variants";

/** Valor que la escena lee en cada frame sin provocar renders (p. ej. un MotionValue de motion). */
export interface FrameValue {
  get(): number;
}

/** Props de cada escena 3D. Las claves son los ids que acepta Scene3DSlot. */
export interface SceneProps {
  /** Hero: rodilla que pasa de inflamada a sana con el scroll y la interacción. */
  joint: { progress?: FrameValue };
  /** Triage: holograma con hotspots por zona. */
  hologram: {
    selected: BodyZoneId | null;
    onSelect: (zone: BodyZoneId) => void;
    /** Zona bajo el cursor (para mostrar su nombre en el DOM). */
    onHover?: (zone: BodyZoneId | null) => void;
  };
  /** Comparador: posición del divisor (0 = todo guiado, 1 = todo a ciegas). */
  ultrasound: { split: FrameValue };
  /** Densitometría: corte de hueso trabecular que se adelgaza según el estado elegido. */
  bone: { level: BoneDensityLevel };
  /** Nivel 2: objeto por pilar, tratamiento o condición. energy: hover (0..1) o curación en el triage. */
  micro: { variant: MicroVariant; energy?: FrameValue };
}

export type SceneId = keyof SceneProps;

/** Mira del comparador (fracción del ancho/alto desde abajo-izquierda). La comparten el shader y el DOM. */
export const ULTRASOUND_TARGET = { x: 0.64, y: 0.42 } as const;
