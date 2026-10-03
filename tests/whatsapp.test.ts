import { describe, expect, it } from "vitest";
import {
  buildAppointmentMessage,
  buildMailtoLink,
  buildWhatsAppLink,
  messageAbout,
  messageForDoctor,
  validateAppointment,
} from "@/lib/whatsapp";
import type { Appointment } from "@/types/medical";

const base: Appointment = {
  modality: "presencial",
  forWhom: "familiar",
  specialty: "Artrosis",
  fullName: "  María Pérez ",
  phone: "987 654 321",
  reason: "Dolor de rodilla al subir escaleras",
  preferredDate: "2026-10-12",
};

describe("buildWhatsAppLink", () => {
  it("encodes the message and strips non-digits from the number", () => {
    const link = buildWhatsAppLink("+51 999 000 000", "Hola & gracias");
    expect(link).toBe("https://wa.me/51999000000?text=Hola%20%26%20gracias");
  });
});

describe("buildAppointmentMessage", () => {
  it("includes every field in a structured, trimmed message", () => {
    const msg = buildAppointmentMessage({ ...base, doctorName: "Dra. Lucía Andrade" });
    expect(msg).toContain("Hola SERMEKARE, quisiera agendar una consulta.");
    expect(msg).toContain("• Modalidad: Presencial (sede San Borja)");
    expect(msg).toContain("• Para: Un familiar");
    expect(msg).toContain("• Especialidad: Artrosis");
    expect(msg).toContain("• Médico: Dra. Lucía Andrade");
    expect(msg).toContain("• Nombre: María Pérez");
    expect(msg).toContain("• Teléfono: 987 654 321");
    expect(msg).toContain("• Motivo: Dolor de rodilla al subir escaleras");
    expect(msg).toContain("• Fecha preferida: lunes 12 de octubre");
  });

  it("omits optional fields when missing", () => {
    const msg = buildAppointmentMessage({ ...base, preferredDate: undefined, modality: "teleconsulta", forWhom: "mi" });
    expect(msg).not.toContain("Médico");
    expect(msg).not.toContain("Fecha preferida");
    expect(msg).toContain("• Modalidad: Teleconsulta");
    expect(msg).toContain("• Para: Mí");
  });
});

describe("validateAppointment", () => {
  it("accepts a valid appointment", () => {
    expect(validateAppointment(base, true, new Date("2026-10-03T12:00:00-05:00"))).toEqual({});
  });

  it("flags missing name, short phone, empty reason and no consent", () => {
    const errors = validateAppointment({ ...base, fullName: " ", phone: "123", reason: "" }, false);
    expect(Object.keys(errors).sort()).toEqual(["consent", "fullName", "phone", "reason"]);
  });

  it("rejects a past preferred date", () => {
    const errors = validateAppointment({ ...base, preferredDate: "2020-01-01" }, true, new Date("2026-10-03T12:00:00-05:00"));
    expect(errors.preferredDate).toBeDefined();
  });
});

describe("messageAbout", () => {
  it("adapts the base message to a topic and optional doctor", () => {
    expect(messageAbout("Gota")).toBe("Hola SERMEKARE, quisiera agendar una consulta por gota.");
    expect(messageAbout("Rodillas", "Dra. Ana")).toBe(
      "Hola SERMEKARE, quisiera agendar una consulta con Dra. Ana por rodillas.",
    );
  });
});

describe("messageForDoctor", () => {
  it("asks for an appointment with a specific doctor", () => {
    expect(messageForDoctor("Dr. Luis Prado")).toBe(
      "Hola SERMEKARE, quisiera agendar una consulta con Dr. Luis Prado.",
    );
  });
});

describe("buildMailtoLink", () => {
  it("builds an encoded mailto link", () => {
    expect(buildMailtoLink("a@b.com", "Cita", "Hola mundo")).toBe(
      "mailto:a@b.com?subject=Cita&body=Hola%20mundo",
    );
  });
});
