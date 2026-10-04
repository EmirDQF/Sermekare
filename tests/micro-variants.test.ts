import { describe, expect, it } from "vitest";
import { servicePillars } from "@/data/services";
import { specialties } from "@/data/specialties";
import { treatments } from "@/data/treatments";
import { CONDITION_VARIANTS, PILLAR_VARIANTS, TREATMENT_VARIANTS, isMicroVariant } from "@/lib/micro-variants";

describe("micro 3D variants", () => {
  it("cover every service pillar", () => {
    expect([...PILLAR_VARIANTS].sort()).toEqual(servicePillars.map((pillar) => pillar.slug).sort());
  });

  it("cover every treatment", () => {
    expect([...TREATMENT_VARIANTS].sort()).toEqual(treatments.map((treatment) => treatment.slug).sort());
  });

  it("cover every condition shown in the triage", () => {
    const triage = specialties.filter((specialty) => specialty.inTriage).map((specialty) => specialty.slug);
    for (const slug of triage) expect(CONDITION_VARIANTS).toContain(slug);
  });

  it("rejects unknown slugs", () => {
    expect(isMicroVariant("procedimientos")).toBe(true);
    expect(isMicroVariant("no-existe")).toBe(false);
  });
});
