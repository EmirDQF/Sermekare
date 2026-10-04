import { describe, expect, it } from "vitest";
import { downgradeTier, pickQualityTier } from "@/lib/quality";

describe("pickQualityTier", () => {
  it("uses the mobile tier on small touch screens", () => {
    expect(pickQualityTier({ cores: 8, memoryGb: 8, coarsePointer: true, viewportWidth: 390 })).toBe("mobile");
  });

  it("uses the mobile tier on any narrow viewport", () => {
    expect(pickQualityTier({ cores: 16, memoryGb: 16, coarsePointer: false, viewportWidth: 700 })).toBe("mobile");
  });

  it("uses the high tier on capable desktops", () => {
    expect(pickQualityTier({ cores: 8, memoryGb: 16, coarsePointer: false, viewportWidth: 1440 })).toBe("high");
  });

  it("treats unknown memory as enough when cores are plenty", () => {
    expect(pickQualityTier({ cores: 12, coarsePointer: false, viewportWidth: 1920 })).toBe("high");
  });

  it("uses the medium tier on modest desktops", () => {
    expect(pickQualityTier({ cores: 4, memoryGb: 8, coarsePointer: false, viewportWidth: 1366 })).toBe("medium");
    expect(pickQualityTier({ cores: 8, memoryGb: 4, coarsePointer: false, viewportWidth: 1366 })).toBe("medium");
  });

  it("keeps tablets in landscape on medium, not mobile", () => {
    expect(pickQualityTier({ cores: 8, memoryGb: 8, coarsePointer: true, viewportWidth: 1180 })).toBe("medium");
  });
});

describe("downgradeTier", () => {
  it("steps down one level and stops at mobile", () => {
    expect(downgradeTier("high")).toBe("medium");
    expect(downgradeTier("medium")).toBe("mobile");
    expect(downgradeTier("mobile")).toBe("mobile");
  });
});
