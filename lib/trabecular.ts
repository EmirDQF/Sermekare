import { createRandom } from "@/lib/prng";
import type { BoneDensityLevel } from "@/types/medical";

/**
 * Red trabecular procedural (el "panal" interno del hueso) para BoneDensity3D.
 * Datos puros: la escena los convierte en puntales instanciados.
 */

export type Point3 = readonly [x: number, y: number, z: number];

export interface Strut {
  from: number;
  to: number;
  /** Los puntales con umbral alto son los primeros en desaparecer cuando baja la densidad. */
  threshold: number;
}

export interface TrabecularLattice {
  nodes: readonly Point3[];
  struts: readonly Strut[];
}

interface LatticeOptions {
  radius: number;
  height: number;
  spacing: number;
  seed: number;
}

/** Densidad (0..1) de cada categoría de la OMS. */
export const DENSITY_BY_LEVEL: Record<BoneDensityLevel, number> = {
  normal: 1,
  osteopenia: 0.68,
  osteoporosis: 0.38,
};

const JITTER = 0.35;
const LINK_FACTOR = 1.45;
const FADE_WIDTH = 0.08;

export function buildTrabecularLattice({ radius, height, spacing, seed }: LatticeOptions): TrabecularLattice {
  const random = createRandom(seed);
  const nodes: Point3[] = [];
  const steps = Math.floor(radius / spacing);
  const levels = Math.round(height / 2 / spacing);
  for (let ix = -steps; ix <= steps; ix++) {
    for (let iz = -steps; iz <= steps; iz++) {
      for (let iy = -levels; iy <= levels; iy++) {
        const x = (ix + (random() - 0.5) * JITTER) * spacing;
        const z = (iz + (random() - 0.5) * JITTER) * spacing;
        const y = (iy + (random() - 0.5) * JITTER) * spacing;
        if (Math.hypot(x, z) <= radius * 0.94 && Math.abs(y) <= height / 2) nodes.push([x, y, z]);
      }
    }
  }

  const maxLength = spacing * LINK_FACTOR;
  const struts: Strut[] = [];
  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const [ax, ay, az] = nodes[a];
      const [bx, by, bz] = nodes[b];
      if (Math.hypot(ax - bx, ay - by, az - bz) <= maxLength) struts.push({ from: a, to: b, threshold: random() });
    }
  }
  return { nodes, struts };
}

/** 1 = puntal completo, 0 = desaparecido, con un fundido corto alrededor del umbral. */
export function strutVisibility(threshold: number, density: number): number {
  const t = (density - threshold) / FADE_WIDTH;
  return Math.min(1, Math.max(0, t));
}
