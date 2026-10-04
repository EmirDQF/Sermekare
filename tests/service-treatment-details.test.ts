import { describe, expect, it } from "vitest";
import { servicePillars } from "@/data/services";
import { treatments } from "@/data/treatments";
import { getServiceDetail, serviceDetails } from "@/data/service-details";
import { getTreatmentDetail, treatmentDetails } from "@/data/treatment-details";

describe("service details", () => {
  it("exist for every service pillar", () => {
    expect(Object.keys(serviceDetails).sort()).toEqual(servicePillars.map((pillar) => pillar.slug).sort());
  });

  it("describe every sub-service of the pillar", () => {
    for (const pillar of servicePillars) {
      const detail = getServiceDetail(pillar.slug);
      for (const service of pillar.services) expect(detail.serviceNotes[service.name]).toBeTruthy();
    }
  });

  it("only link to treatments that exist", () => {
    const slugs = new Set(treatments.map((treatment) => treatment.slug));
    for (const detail of Object.values(serviceDetails)) {
      for (const slug of detail.relatedTreatments) expect(slugs.has(slug)).toBe(true);
    }
  });
});

describe("treatment details", () => {
  it("exist for every treatment", () => {
    expect(Object.keys(treatmentDetails).sort()).toEqual(treatments.map((treatment) => treatment.slug).sort());
  });

  it("explain the procedure step by step and the aftercare", () => {
    for (const treatment of treatments) {
      const detail = getTreatmentDetail(treatment.slug);
      expect(detail.procedure.length).toBeGreaterThanOrEqual(3);
      expect(detail.aftercare.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("belong to an existing service pillar", () => {
    const pillars = new Set(servicePillars.map((pillar) => pillar.slug));
    for (const detail of Object.values(treatmentDetails)) expect(pillars.has(detail.pillarSlug)).toBe(true);
  });

  it("throw for unknown slugs", () => {
    expect(() => getTreatmentDetail("no-existe")).toThrow();
    expect(() => getServiceDetail("no-existe")).toThrow();
  });
});
