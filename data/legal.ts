/**
 * Datos legales de la empresa. PROVISIONAL: reemplazar por la razón social, el RUC y los datos
 * reales, y revisar los textos legales con asesoría legal antes de publicar.
 */
export const legal = {
  businessName: "SERMEKARE S.A.C. (razón social por confirmar)",
  ruc: "00000000000",
  fiscalAddress: "Av. Aviación 2450, San Borja, Lima",
  complaintsEmail: "reclamaciones@sermekare.com",
  /** Plazo máximo de respuesta del Libro de Reclamaciones (días hábiles). */
  responseDays: 15,
  lastUpdated: "2026-10-04",
  provisional: true,
} as const;

/** Enlaces de interés (organismos y fuentes de información confiables). */
export const usefulLinks = [
  {
    group: "Verifica a tu médico",
    links: [
      {
        label: "Colegio Médico del Perú — Conoce a tu médico",
        href: "https://www.cmp.org.pe/conoce-a-tu-medico/",
        description: "Consulta la colegiatura (CMP) y la especialidad registrada (RNE) de cualquier médico.",
      },
    ],
  },
  {
    group: "Tus derechos en salud",
    links: [
      {
        label: "SUSALUD",
        href: "https://www.gob.pe/susalud",
        description: "Superintendencia Nacional de Salud: derechos de los pacientes y orientación.",
      },
      {
        label: "INDECOPI",
        href: "https://www.gob.pe/indecopi",
        description: "Protección al consumidor y Libro de Reclamaciones.",
      },
      {
        label: "Ministerio de Salud (MINSA)",
        href: "https://www.gob.pe/minsa",
        description: "Información oficial de salud pública en el Perú.",
      },
    ],
  },
  {
    group: "Información para pacientes",
    links: [
      {
        label: "International Osteoporosis Foundation",
        href: "https://www.osteoporosis.foundation",
        description: "Recursos sobre salud ósea y prevención de fracturas (en inglés).",
      },
      {
        label: "EULAR — Liga Europea contra el Reumatismo",
        href: "https://www.eular.org",
        description: "Información y recomendaciones sobre enfermedades reumáticas (en inglés).",
      },
    ],
  },
] as const;
