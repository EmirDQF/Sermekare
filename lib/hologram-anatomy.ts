import type { BodyZoneId } from "@/types/medical";

/**
 * Anatomía estilizada del holograma del triage (unidades de escena, eje Y hacia arriba,
 * la figura mira hacia +Z). Datos puros: BodyHologram3D construye la geometría a partir de aquí.
 */

export type Vec3 = readonly [x: number, y: number, z: number];

export type BodyPartShape =
  | { kind: "sphere"; radius: number }
  | { kind: "capsule"; radius: number; length: number }
  | { kind: "cylinder"; radiusTop: number; radiusBottom: number; height: number };

export interface BodyPart {
  shape: BodyPartShape;
  position: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
}

/** Altura total aproximada de la figura (de los pies a la coronilla). */
export const HOLOGRAM_HEIGHT = 3.6;

const SIDES = [-1, 1] as const;

function mirrored(build: (side: -1 | 1) => BodyPart): BodyPart[] {
  return SIDES.map(build);
}

export const HOLOGRAM_BODY: readonly BodyPart[] = [
  { shape: { kind: "sphere", radius: 0.2 }, position: [0, 1.56, 0], scale: [0.92, 1.12, 1] },
  { shape: { kind: "cylinder", radiusTop: 0.072, radiusBottom: 0.085, height: 0.2 }, position: [0, 1.3, 0] },
  { shape: { kind: "capsule", radius: 0.27, length: 0.5 }, position: [0, 0.86, 0], scale: [1.3, 1, 0.68] },
  { shape: { kind: "sphere", radius: 0.27 }, position: [0, 0.22, 0], scale: [1.15, 0.72, 0.72] },
  ...mirrored((side) => ({
    shape: { kind: "capsule", radius: 0.072, length: 0.44 },
    position: [side * 0.47, 0.88, 0],
    rotation: [0, 0, side * 0.12],
  })),
  ...mirrored((side) => ({
    shape: { kind: "capsule", radius: 0.062, length: 0.42 },
    position: [side * 0.54, 0.36, 0.02],
    rotation: [0, 0, side * 0.06],
  })),
  ...mirrored((side) => ({
    shape: { kind: "sphere", radius: 0.07 },
    position: [side * 0.575, 0.04, 0.03],
    scale: [0.8, 1.35, 0.55],
  })),
  ...mirrored((side) => ({
    shape: { kind: "capsule", radius: 0.105, length: 0.6 },
    position: [side * 0.15, -0.3, 0],
    rotation: [0, 0, side * -0.04],
  })),
  ...mirrored((side) => ({
    shape: { kind: "capsule", radius: 0.08, length: 0.74 },
    position: [side * 0.165, -1.16, 0],
  })),
  ...mirrored((side) => ({
    shape: { kind: "capsule", radius: 0.06, length: 0.14 },
    position: [side * 0.175, -1.68, 0.07],
    rotation: [Math.PI / 2, 0, 0],
  })),
];

/**
 * Punto de cada zona de data/bodyZones.ts. Respeta el lado que usa el BodyMap 2D
 * (hombro, mano y rodilla a la izquierda de la imagen; cadera y pie a la derecha).
 */
export const HOLOGRAM_HOTSPOTS: Record<BodyZoneId, Vec3> = {
  cuello: [0, 1.3, 0.1],
  hombros: [-0.43, 1.14, 0.06],
  espalda: [0, 0.66, -0.02],
  manos: [-0.575, 0.04, 0.08],
  cadera: [0.24, 0.2, 0.12],
  rodillas: [-0.155, -0.68, 0.1],
  pies: [0.18, -1.7, 0.14],
};

/** Columna vertebral visible a través del holograma (efecto rayos X). */
export const HOLOGRAM_SPINE = { from: 0.3, to: 1.32, z: -0.06, vertebrae: 13 } as const;
