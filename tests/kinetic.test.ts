import { describe, expect, it } from "vitest";
import { splitKineticWords } from "@/lib/kinetic";

describe("splitKineticWords", () => {
  it("splits a title into words without an accent", () => {
    expect(splitKineticWords("¿Dónde te duele?")).toEqual([
      { word: "¿Dónde", accent: false },
      { word: "te", accent: false },
      { word: "duele?", accent: false },
    ]);
  });

  it("marks every word of the accent phrase", () => {
    expect(splitKineticWords("Infiltración guiada por ecografía vs a ciegas", "guiada por ecografía")).toEqual([
      { word: "Infiltración", accent: false },
      { word: "guiada", accent: true },
      { word: "por", accent: true },
      { word: "ecografía", accent: true },
      { word: "vs", accent: false },
      { word: "a", accent: false },
      { word: "ciegas", accent: false },
    ]);
  });

  it("ignores an accent that is not part of the text", () => {
    expect(splitKineticWords("Hola mundo", "adiós").every(({ accent }) => !accent)).toBe(true);
  });

  it("collapses repeated whitespace", () => {
    expect(splitKineticWords("  Hola   mundo ").map(({ word }) => word)).toEqual(["Hola", "mundo"]);
  });
});
