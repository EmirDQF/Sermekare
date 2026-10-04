import { describe, expect, it } from "vitest";
import { DENSITY_BY_LEVEL, buildTrabecularLattice, strutVisibility } from "@/lib/trabecular";

const RADIUS = 1;
const HEIGHT = 1.2;

describe("buildTrabecularLattice", () => {
  const lattice = buildTrabecularLattice({ radius: RADIUS, height: HEIGHT, spacing: 0.3, seed: 7 });

  it("is deterministic for the same seed", () => {
    const again = buildTrabecularLattice({ radius: RADIUS, height: HEIGHT, spacing: 0.3, seed: 7 });
    expect(again.struts).toEqual(lattice.struts);
  });

  it("creates a connected honeycomb of struts", () => {
    expect(lattice.nodes.length).toBeGreaterThan(40);
    expect(lattice.struts.length).toBeGreaterThan(lattice.nodes.length);
  });

  it("keeps every node inside the bone cylinder", () => {
    for (const [x, y, z] of lattice.nodes) {
      expect(Math.hypot(x, z)).toBeLessThanOrEqual(RADIUS);
      expect(Math.abs(y)).toBeLessThanOrEqual(HEIGHT / 2);
    }
  });

  it("gives every strut a fragility threshold in [0, 1)", () => {
    for (const strut of lattice.struts) {
      expect(strut.threshold).toBeGreaterThanOrEqual(0);
      expect(strut.threshold).toBeLessThan(1);
    }
  });
});

describe("strutVisibility", () => {
  it("keeps sturdy struts and removes fragile ones as density drops", () => {
    expect(strutVisibility(0.1, DENSITY_BY_LEVEL.normal)).toBe(1);
    expect(strutVisibility(0.9, DENSITY_BY_LEVEL.osteoporosis)).toBe(0);
  });

  it("orders the levels from dense to porous", () => {
    expect(DENSITY_BY_LEVEL.normal).toBeGreaterThan(DENSITY_BY_LEVEL.osteopenia);
    expect(DENSITY_BY_LEVEL.osteopenia).toBeGreaterThan(DENSITY_BY_LEVEL.osteoporosis);
  });
});
