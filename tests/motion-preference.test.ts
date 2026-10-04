import { describe, expect, it } from "vitest";
import { parseStoredPreference, shouldReduceMotion } from "@/lib/motion-preference";

describe("parseStoredPreference", () => {
  it("accepts only the known values", () => {
    expect(parseStoredPreference("reduce")).toBe("reduce");
    expect(parseStoredPreference("full")).toBe("full");
    expect(parseStoredPreference("auto")).toBe("auto");
  });

  it("falls back to auto for missing or tampered values", () => {
    expect(parseStoredPreference(null)).toBe("auto");
    expect(parseStoredPreference("<script>")).toBe("auto");
  });
});

describe("shouldReduceMotion", () => {
  it("follows the system setting in auto mode", () => {
    expect(shouldReduceMotion("auto", true)).toBe(true);
    expect(shouldReduceMotion("auto", false)).toBe(false);
  });

  it("lets the footer switch force reduced motion", () => {
    expect(shouldReduceMotion("reduce", false)).toBe(true);
  });

  it("never overrides a system request for reduced motion", () => {
    expect(shouldReduceMotion("full", true)).toBe(true);
    expect(shouldReduceMotion("full", false)).toBe(false);
  });
});
