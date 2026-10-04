/**
 * Libro de Reclamaciones virtual: validación y armado del mensaje.
 * Reclamo: disconformidad con el servicio. Queja: malestar con la atención, sin relación con el servicio.
 */

export type ComplaintKind = "reclamo" | "queja";
export type DocumentType = "DNI" | "CE" | "Pasaporte";

export interface Complaint {
  kind: ComplaintKind;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  isMinor: boolean;
  /** Padre, madre o apoderado (obligatorio si el consumidor es menor de edad). */
  guardianName: string;
  serviceDescription: string;
  amount: string;
  detail: string;
  request: string;
}

export type ComplaintField = keyof Complaint | "consent";
export type ComplaintErrors = Partial<Record<ComplaintField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DNI = /^\d{8}$/;
const OTHER_DOCUMENT = /^[A-Za-z0-9]{6,15}$/;
const PHONE = /^[\d\s+()-]{7,20}$/;
const MIN_DETAIL = 20;
const MIN_REQUEST = 5;

export const COMPLAINT_LIMITS = { name: 120, address: 200, service: 200, detail: 2000, request: 1000 } as const;

function blank(value: string): boolean {
  return value.trim().length === 0;
}

export function validateComplaint(c: Complaint, consent: boolean): ComplaintErrors {
  const errors: ComplaintErrors = {};
  if (blank(c.fullName)) errors.fullName = "Escribe tu nombre completo.";
  const documentPattern = c.documentType === "DNI" ? DNI : OTHER_DOCUMENT;
  if (!documentPattern.test(c.documentNumber.trim())) {
    errors.documentNumber = c.documentType === "DNI" ? "El DNI debe tener 8 dígitos." : "Revisa el número de documento.";
  }
  if (!EMAIL.test(c.email.trim())) errors.email = "Escribe un correo válido: ahí te enviaremos la respuesta.";
  if (!PHONE.test(c.phone.trim())) errors.phone = "Escribe un teléfono válido.";
  if (blank(c.address)) errors.address = "Escribe tu dirección.";
  if (c.isMinor && blank(c.guardianName)) errors.guardianName = "Escribe el nombre del padre, madre o apoderado.";
  if (blank(c.serviceDescription)) errors.serviceDescription = "Indica el servicio contratado.";
  if (c.detail.trim().length < MIN_DETAIL) errors.detail = "Cuéntanos con un poco más de detalle qué ocurrió.";
  if (c.request.trim().length < MIN_REQUEST) errors.request = "Indica qué solicitas.";
  if (!consent) errors.consent = "Necesitamos tu autorización para tratar tus datos y responderte.";
  return errors;
}

/** Texto del reclamo/queja para enviar a la clínica (y conservar como constancia). */
export function buildComplaintMessage(c: Complaint, dateISO: string): string {
  const lines = [
    `LIBRO DE RECLAMACIONES — ${c.kind.toUpperCase()}`,
    `Fecha: ${dateISO}`,
    "",
    "1. Identificación del consumidor",
    `Nombre: ${c.fullName.trim()}`,
    `Documento: ${c.documentType} ${c.documentNumber.trim()}`,
    `Correo: ${c.email.trim()}`,
    `Teléfono: ${c.phone.trim()}`,
    `Dirección: ${c.address.trim()}`,
    c.isMinor ? `Padre, madre o apoderado: ${c.guardianName.trim()}` : "Menor de edad: No",
    "",
    "2. Identificación del servicio contratado",
    `Servicio: ${c.serviceDescription.trim()}`,
    `Monto reclamado: ${c.amount.trim() || "No indica"}`,
    "",
    `3. Detalle del ${c.kind}`,
    c.detail.trim(),
    "",
    "Pedido del consumidor",
    c.request.trim(),
  ];
  return lines.join("\n");
}
