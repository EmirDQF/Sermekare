import { describe, expect, it } from "vitest";
import { bodyZones } from "@/data/bodyZones";
import { HOLOGRAM_HOTSPOTS, HOLOGRAM_HEIGHT } from "@/lib/hologram-anatomy";

describe("HOLOGRAM_HOTSPOTS", () => {
  it("covers exactly the zones of data/bodyZones.ts", () => {
    expect(Object.keys(HOLOGRAM_HOTSPOTS).sort()).toEqual(bodyZones.map((zone) => zone.id).sort());
  });

  it("keeps every hotspot inside the figure's height", () => {
    const half = HOLOGRAM_HEIGHT / 2;
    for (const [x, y] of Object.values(HOLOGRAM_HOTSPOTS)) {
      expect(Math.abs(y)).toBeLessThanOrEqual(half);
      expect(Math.abs(x)).toBeLessThan(1);
    }
  });

  it("orders the zones from head to feet", () => {
    const { cuello, hombros, cadera, rodillas, pies } = HOLOGRAM_HOTSPOTS;
    const heights = [cuello, hombros, cadera, rodillas, pies].map(([, y]) => y);
    expect(heights).toEqual([...heights].sort((a, b) => b - a));
  });
});
