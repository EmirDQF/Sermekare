import { describe, expect, it } from "vitest";
import { breadcrumbSchema, diagnosticProcedureSchema } from "@/lib/schema";
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
