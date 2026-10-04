import { describe, expect, it } from "vitest";
import { createRandom } from "@/lib/prng";

describe("createRandom", () => {
  it("is deterministic for the same seed", () => {
    const a = createRandom(42);
    const b = createRandom(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces different sequences for different seeds", () => {
    expect(createRandom(1)()).not.toBe(createRandom(2)());
  });

  it("stays within [0, 1)", () => {
    const random = createRandom(7);
    for (let i = 0; i < 1000; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
