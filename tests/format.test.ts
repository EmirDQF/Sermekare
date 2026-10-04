import { describe, expect, it } from "vitest";
import { formatLongDate, formatStat } from "@/lib/format";

describe("formatStat", () => {
  it("adds prefix and thousands separator", () => {
    expect(formatStat({ prefix: "+" }, 15000)).toBe("+15,000");
  });

  it("keeps the configured decimals", () => {
    expect(formatStat({ decimals: 1 }, 4.9)).toBe("4.9");
    expect(formatStat({ decimals: 1 }, 4)).toBe("4.0");
  });

  it("rounds intermediate animation values", () => {
    expect(formatStat({ prefix: "+" }, 7499.6)).toBe("+7,500");
  });
});

describe("formatLongDate", () => {
  it("formats ISO dates in Peruvian Spanish (setiembre) without timezone drift", () => {
    expect(formatLongDate("2026-09-22")).toBe("22 de setiembre de 2026");
  });
});
