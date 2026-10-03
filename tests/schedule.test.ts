import { describe, expect, it } from "vitest";
import { getOpenStatus } from "@/lib/schedule";
import type { OpeningHours } from "@/types/medical";

const hours: OpeningHours = {
  days: [1, 2, 3, 4, 5, 6],
  opensAt: 8 * 60,
  closesAt: 20 * 60,
  timeZone: "America/Lima",
  label: "Lun a sáb · 8:00 a.m. – 8:00 p.m.",
  closedLabel: "Domingo cerrado",
};

// Lima es UTC-5 todo el año (sin horario de verano).
const limaTime = (iso: string) => new Date(`${iso}-05:00`);

describe("getOpenStatus", () => {
  it("is open on a weekday within hours", () => {
    // 2026-10-05 es lunes
    expect(getOpenStatus(hours, limaTime("2026-10-05T10:30:00")).isOpen).toBe(true);
  });

  it("is open on Saturday within hours", () => {
    expect(getOpenStatus(hours, limaTime("2026-10-03T19:59:00")).isOpen).toBe(true);
  });

  it("is closed exactly at closing time", () => {
    expect(getOpenStatus(hours, limaTime("2026-10-05T20:00:00")).isOpen).toBe(false);
  });

  it("is closed before opening time", () => {
    expect(getOpenStatus(hours, limaTime("2026-10-05T07:59:00")).isOpen).toBe(false);
  });

  it("is closed all Sunday", () => {
    expect(getOpenStatus(hours, limaTime("2026-10-04T12:00:00")).isOpen).toBe(false);
  });

  it("uses Lima time, not the host time zone", () => {
    // 2026-10-06T00:30Z = lunes 19:30 en Lima → abierto
    expect(getOpenStatus(hours, new Date("2026-10-06T00:30:00Z")).isOpen).toBe(true);
  });

  it("describes when it opens next while closed on Saturday night", () => {
    const status = getOpenStatus(hours, limaTime("2026-10-03T21:00:00"));
    expect(status.isOpen).toBe(false);
    expect(status.nextChange).toBe("Abrimos el lunes a las 8:00 a.m.");
  });

  it("describes opening later today before opening time", () => {
    const status = getOpenStatus(hours, limaTime("2026-10-05T06:00:00"));
    expect(status.nextChange).toBe("Abrimos hoy a las 8:00 a.m.");
  });

  it("describes closing time while open", () => {
    const status = getOpenStatus(hours, limaTime("2026-10-05T09:00:00"));
    expect(status.nextChange).toBe("Hasta las 8:00 p.m.");
  });

  it("describes opening tomorrow on a weekday night", () => {
    const status = getOpenStatus(hours, limaTime("2026-10-05T22:00:00"));
    expect(status.nextChange).toBe("Abrimos mañana a las 8:00 a.m.");
  });
});
