import { describe, expect, it } from "vitest";
import { breadcrumbSchema, diagnosticProcedureSchema, medicalServiceSchema, procedureSchema } from "@/lib/schema";
import { site } from "@/data/site";

describe("breadcrumbSchema", () => {
  it("lists absolute URLs in order", () => {
    const schema = breadcrumbSchema([
      { label: "Inicio", href: "/" },
      { label: "Densitometría ósea", href: "/densitometria-osea" },
    ]) as { itemListElement: { position: number; item: string }[] };
    expect(schema.itemListElement.map((i) => [i.position, i.item])).toEqual([
      [1, `${site.url}/`],
      [2, `${site.url}/densitometria-osea`],
    ]);
  });
});

describe("diagnosticProcedureSchema", () => {
  it("is a non-invasive diagnostic procedure linked to the clinic", () => {
    const schema = diagnosticProcedureSchema({
      name: "Densitometría ósea",
      alternateName: ["DXA"],
      description: "d",
      path: "/densitometria-osea",
      bodyLocation: "Columna lumbar y cadera",
      howPerformed: "h",
      preparation: "p",
      followup: "f",
    });
    expect(schema["@type"]).toBe("DiagnosticProcedure");
    expect(schema.procedureType).toBe("https://schema.org/NoninvasiveProcedure");
    expect(schema.availableAt).toEqual({ "@id": `${site.url}/#clinic` });
  });
});

describe("procedureSchema and medicalServiceSchema", () => {
  it("marks therapeutic procedures with their own type", () => {
    const schema = procedureSchema("TherapeuticProcedure", {
      name: "Infiltración",
      alternateName: [],
      description: "d",
      path: "/tratamientos/infiltraciones-ecoguiadas",
      bodyLocation: "Articulaciones",
      howPerformed: "h",
      preparation: "p",
      followup: "f",
    });
    expect(schema["@type"]).toBe("TherapeuticProcedure");
  });

  it("lists every sub-service as an offer of the clinic", () => {
    const schema = medicalServiceSchema({ name: "Telemedicina", description: "d", path: "/servicios/telemedicina", offers: ["A", "B"] });
    const catalog = schema.hasOfferCatalog as { itemListElement: { itemOffered: { name: string } }[] };
    expect(catalog.itemListElement.map((item) => item.itemOffered.name)).toEqual(["A", "B"]);
    expect(schema.provider).toEqual({ "@id": `${site.url}/#clinic` });
  });
});
