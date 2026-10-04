import type { TreatmentDetail } from "@/types/medical";

/**
 * Contenido de /tratamientos/[slug]: cómo es el procedimiento y los cuidados.
 * PROVISIONAL: indicaciones generales; cada paciente recibe las suyas. Validar con el equipo médico.
 */
export const treatmentDetails: Readonly<Record<string, TreatmentDetail>> = {
  "infiltraciones-ecoguiadas": {
    pillarSlug: "procedimientos",
    kind: "therapeutic",
    procedure: [
      "Tu especialista revisa tu caso y confirma que la infiltración es adecuada para ti.",
      "Con la ecografía ubica la articulación o el tendón que se va a tratar.",
      "Se limpia la piel y se aplica el medicamento guiando la aguja en tiempo real.",
      "Descansas unos minutos y te vas caminando el mismo día.",
    ],
    aftercare: [
      "Evita esfuerzos intensos con la zona tratada durante las primeras 24 a 48 horas, salvo otra indicación.",
      "Es normal una molestia leve los primeros días; consulta si aparece fiebre, enrojecimiento o hinchazón importante.",
      "Sigue el plan de ejercicios y controles que te indique tu especialista.",
    ],
  },
  "terapias-biologicas": {
    pillarSlug: "apoyo-terapeutico",
    kind: "therapeutic",
    procedure: [
      "Evaluamos tu enfermedad, tus tratamientos previos y tus análisis.",
      "Antes de iniciar revisamos tus vacunas y descartamos infecciones, según el protocolo de cada medicamento.",
      "Aplicamos el medicamento por vía endovenosa o subcutánea, o te enseñamos a usarlo en casa.",
      "Controlamos tu respuesta y tus análisis en citas programadas.",
    ],
    aftercare: [
      "Cumple las fechas de aplicación y de análisis de control.",
      "Avísanos si tienes fiebre o una infección, o si necesitas una cirugía o una vacuna.",
      "Escríbenos por WhatsApp ante cualquier duda entre sesiones.",
    ],
  },
  viscosuplementacion: {
    pillarSlug: "procedimientos",
    kind: "therapeutic",
    procedure: [
      "Tu especialista confirma que tu tipo de artrosis puede beneficiarse del ácido hialurónico.",
      "Ubica la articulación con ecografía.",
      "Aplica el gel dentro de la articulación con una aguja fina, guiada por la imagen.",
      "Según el producto, puede ser una sola aplicación o una serie corta.",
    ],
    aftercare: [
      "Reposo relativo de la articulación el primer día, salvo otra indicación.",
      "Puedes notar una molestia leve los primeros días; consulta si aumenta el dolor o la hinchazón.",
      "Combínalo con ejercicio y control de peso para mejores resultados.",
    ],
  },
  "terapia-fisica": {
    pillarSlug: "consulta-externa",
    kind: "therapeutic",
    procedure: [
      "Evaluamos tu movilidad, tu fuerza y lo que te cuesta hacer en el día a día.",
      "Diseñamos un plan de ejercicios con metas realistas.",
      "Trabajas con tu terapeuta en sesiones guiadas.",
      "Te dejamos una rutina para continuar en casa.",
    ],
    aftercare: [
      "Haz la rutina en casa con la frecuencia indicada.",
      "Avísanos si un ejercicio te provoca dolor intenso.",
      "Progresa poco a poco: la constancia importa más que la intensidad.",
    ],
  },
  "laboratorio-y-densitometria": {
    pillarSlug: "apoyo-diagnostico",
    kind: "diagnostic",
    procedure: [
      "Tu especialista indica los análisis o estudios que necesitas.",
      "La toma de muestras o la densitometría se hace en la misma sede.",
      "Recibes tus resultados y tu especialista te los explica junto con tu historia clínica.",
    ],
    aftercare: [
      "Para la densitometría: no tomes suplementos de calcio 24 horas antes y usa ropa sin metales.",
      "Algunos análisis requieren ayuno: te lo indicamos al agendar.",
      "Lleva tus resultados anteriores para comparar tu evolución.",
    ],
  },
  videocapilaroscopia: {
    pillarSlug: "apoyo-diagnostico",
    kind: "diagnostic",
    procedure: [
      "Te sientas cómodamente y apoyas la mano sobre la mesa.",
      "Se coloca una gota de aceite en la base de la uña.",
      "Una cámara de alta magnificación observa los pequeños vasos de cada dedo, sin agujas ni dolor.",
      "Tu especialista interpreta las imágenes.",
    ],
    aftercare: [
      "Evita cortar o maquillar las cutículas los días previos al estudio.",
      "No necesitas reposo: retomas tus actividades de inmediato.",
    ],
  },
};

export function getTreatmentDetail(slug: string): TreatmentDetail {
  const detail = treatmentDetails[slug];
  if (!detail) throw new Error(`Treatment detail not found: ${slug}`);
  return detail;
}
