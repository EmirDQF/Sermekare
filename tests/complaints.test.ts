import { describe, expect, it } from "vitest";
import { buildComplaintMessage, validateComplaint, type Complaint } from "@/lib/complaints";

const VALID: Complaint = {
  kind: "reclamo",
  fullName: "Ana Pérez",
  documentType: "DNI",
  documentNumber: "12345678",
  email: "ana@example.com",
  phone: "999888777",
  address: "Av. Siempre Viva 123, Lima",
  isMinor: false,
  guardianName: "",
  serviceDescription: "Consulta de reumatología",
  amount: "",
  detail: "Detalle del reclamo con suficiente información para revisarlo.",
  request: "Solicito la devolución del pago.",
};

describe("validateComplaint", () => {
  it("accepts a complete complaint", () => {
    expect(validateComplaint(VALID, true)).toEqual({});
  });

  it("requires identification, contact and the complaint detail", () => {
    const errors = validateComplaint({ ...VALID, fullName: " ", email: "no-es-correo", detail: "corto" }, true);
    expect(Object.keys(errors).sort()).toEqual(["detail", "email", "fullName"]);
  });

  it("validates the DNI length", () => {
    expect(validateComplaint({ ...VALID, documentNumber: "123" }, true).documentNumber).toBeTruthy();
  });

  it("requires a guardian for minors", () => {
    expect(validateComplaint({ ...VALID, isMinor: true }, true).guardianName).toBeTruthy();
  });

  it("requires accepting the data treatment notice", () => {
    expect(validateComplaint(VALID, false).consent).toBeTruthy();
  });
});

describe("buildComplaintMessage", () => {
  it("includes the type, the consumer and the request", () => {
    const message = buildComplaintMessage(VALID, "2026-10-04");
    expect(message).toContain("RECLAMO");
    expect(message).toContain("Ana Pérez");
    expect(message).toContain("DNI 12345678");
    expect(message).toContain("Solicito la devolución del pago.");
    expect(message).toContain("2026-10-04");
  });
});
