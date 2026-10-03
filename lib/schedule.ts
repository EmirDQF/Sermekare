import type { OpeningHours, Weekday } from "@/types/medical";

export interface OpenStatus {
  isOpen: boolean;
  /** Texto corto para la UI: "Hasta las 8:00 p.m." / "Abrimos mañana a las 8:00 a.m." */
  nextChange: string;
}

const WEEKDAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"] as const;
const WEEKDAY_INDEX: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const MINUTES_PER_HOUR = 60;
const DAYS_PER_WEEK = 7;

/** 480 → "8:00 a.m.", 1200 → "8:00 p.m." */
export function formatTime(minutesFromMidnight: number): string {
  const hours24 = Math.floor(minutesFromMidnight / MINUTES_PER_HOUR);
  const minutes = minutesFromMidnight % MINUTES_PER_HOUR;
  const suffix = hours24 < 12 ? "a.m." : "p.m.";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** Día de la semana y minutos desde medianoche en la zona horaria indicada. */
export function getZonedClock(date: Date, timeZone: string): { weekday: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    weekday: WEEKDAY_INDEX[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * MINUTES_PER_HOUR + Number(get("minute")),
  };
}

function describeNextOpening(hours: OpeningHours, weekday: Weekday, minutes: number): string {
  const opens = formatTime(hours.opensAt);
  if (hours.days.includes(weekday) && minutes < hours.opensAt) {
    return `Abrimos hoy a las ${opens}`;
  }
  for (let offset = 1; offset <= DAYS_PER_WEEK; offset++) {
    const day = ((weekday + offset) % DAYS_PER_WEEK) as Weekday;
    if (!hours.days.includes(day)) continue;
    return offset === 1 ? `Abrimos mañana a las ${opens}` : `Abrimos el ${WEEKDAY_NAMES[day]} a las ${opens}`;
  }
  return hours.closedLabel;
}

export function getOpenStatus(hours: OpeningHours, now: Date = new Date()): OpenStatus {
  const { weekday, minutes } = getZonedClock(now, hours.timeZone);
  const isOpen = hours.days.includes(weekday) && minutes >= hours.opensAt && minutes < hours.closesAt;
  return {
    isOpen,
    nextChange: isOpen ? `Hasta las ${formatTime(hours.closesAt)}` : describeNextOpening(hours, weekday, minutes),
  };
}

/** Fecha de hoy (YYYY-MM-DD) en la zona horaria indicada. */
export function todayISO(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
