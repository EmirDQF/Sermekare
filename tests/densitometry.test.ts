import { describe, expect, it } from "vitest";
import {
  SCORE_MAX,
  SCORE_MIN,
  checklistOutcome,
  classifyTScore,
  classifyZScore,
  formatScore,
  scoreToPercent,
  stepScore,
} from "@/lib/densitometry";
import { densitometry } from "@/data/densitometry";
import { clinicWhatsApp } from "@/lib/whatsapp";

describe("classifyTScore (OMS)", () => {
  it("is normal at -1.0 or above", () => {
    expect(classifyTScore(1.2)).toBe("normal");
    expect(classifyTScore(-1)).toBe("normal");
  });

  it("is osteopenia strictly between -1.0 and -2.5", () => {
    expect(classifyTScore(-1.1)).toBe("osteopenia");
    expect(classifyTScore(-2.4)).toBe("osteopenia");
  });

  it("is osteoporosis at -2.5 or below", () => {
    expect(classifyTScore(-2.5)).toBe("osteoporosis");
    expect(classifyTScore(-3.8)).toBe("osteoporosis");
  });
});

describe("classifyZScore", () => {
  it("flags -2.0 or below as below the expected range for age", () => {
    expect(classifyZScore(-2)).toBe("below-expected");
    expect(classifyZScore(-3)).toBe("below-expected");
  });

  it("is within the expected range above -2.0", () => {
    expect(classifyZScore(-1.9)).toBe("expected");
    expect(classifyZScore(0.5)).toBe("expected");
  });
});

describe("gauge helpers", () => {
  it("maps the -4..+2 scale to 0..100%", () => {
    expect(scoreToPercent(SCORE_MIN)).toBe(0);
    expect(scoreToPercent(SCORE_MAX)).toBe(100);
    expect(scoreToPercent(-1)).toBe(50);
  });

  it("steps by 0.1 and stays inside the scale without float drift", () => {
    expect(stepScore(-1, 1)).toBe(-0.9);
    expect(stepScore(-2.5, -1)).toBe(-2.6);
    expect(stepScore(SCORE_MAX, 1)).toBe(SCORE_MAX);
    expect(stepScore(SCORE_MIN, -1)).toBe(SCORE_MIN);
  });

  it("formats scores with a real minus sign and comma decimals", () => {
    expect(formatScore(-2.5)).toBe("−2,5");
    expect(formatScore(1)).toBe("+1,0");
    expect(formatScore(0)).toBe("0,0");
  });
});

describe("checklistOutcome", () => {
  it("is neutral before answering", () => {
    expect(checklistOutcome({}, 3)).toBe("pending");
  });

  it("recommends talking to a specialist as soon as there is one yes", () => {
    expect(checklistOutcome({ a: false, b: true }, 3)).toBe("talk-to-specialist");
  });

  it("waits for every answer before offering general guidance", () => {
    expect(checklistOutcome({ a: false, b: false }, 3)).toBe("pending");
    expect(checklistOutcome({ a: false, b: false, c: false }, 3)).toBe("guidance");
  });
});

describe("densitometry CTA", () => {
  it("opens WhatsApp with the exact booking message", () => {
    const url = decodeURIComponent(clinicWhatsApp(densitometry.cta.message));
    expect(url).toContain("Hola SERMEKARE, quisiera agendar una densitometría ósea.");
  });

  it("never gives a diagnosis or a risk score in the checklist copy", () => {
    const copy = densitometry.checklist.map(({ question }) => question).join(" ").toLowerCase();
    expect(copy).not.toMatch(/diagn[oó]stico|puntaje|riesgo de \d/);
  });
});
