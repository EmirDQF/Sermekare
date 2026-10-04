import type { ServiceDetail } from "@/types/medical";

/**
 * Contenido de /servicios/[slug]. PROVISIONAL: descripciones generales para el paciente;
 * validar con el equipo médico antes de publicar.
 */
export const serviceDetails: Readonly<Record<string, ServiceDetail>> = {
  "apoyo-diagnostico": {
    intro:
      "Reunimos en la misma sede los estudios que tu reumatólogo necesita para confirmar un diagnóstico y seguir tu evolución, sin derivarte a otros lugares.",
    highlights: ["Resultados interpretados por tu especialista", "Ecografía durante la misma consulta", "Todo en una sola sede"],
    serviceNotes: {
      "Densitometría ósea": "Mide la densidad de tus huesos para detectar osteopenia u osteoporosis antes de una fractura.",
      Videocapilaroscopía: "Observa los pequeños vasos de la uña para orientar el diagnóstico de enfermedades autoinmunes.",
      "Ecografía musculoesquelética y general": "Permite ver tendones, líquido y cartílago en tiempo real, en la misma consulta.",
      "Laboratorio clínico e inmunológico": "Análisis que ayudan a confirmar el diagnóstico y a controlar tu tratamiento.",
      "Evaluación de osteoporosis severa (VFA)":
        "Imagen lateral de la columna que busca fracturas vertebrales que a veces no dan síntomas.",
      "Análisis de composición corporal":
        "Estima la proporción de músculo, grasa y hueso para orientar tu plan de nutrición y ejercicio.",
      "Densitometría en caderas con prótesis":
        "Protocolo adaptado para medir la densidad ósea cuando ya tienes una prótesis de cadera.",
      "Evaluaciones estandarizadas":
        "Cuestionarios y escalas validadas para medir dolor, función y actividad de la enfermedad en el tiempo.",
    },
    relatedTreatments: ["laboratorio-y-densitometria", "videocapilaroscopia"],
  },
  "apoyo-terapeutico": {
    intro:
      "Nuestra Unidad de Terapia Biológica administra y supervisa tratamientos avanzados en un ambiente seguro, con seguimiento cercano.",
    highlights: ["Sesiones supervisadas por especialistas", "Control de riesgos y vacunas", "Seguimiento por WhatsApp"],
    serviceNotes: {
      "Administración endovenosa y subcutánea":
        "Aplicación supervisada de medicamentos por vena o bajo la piel, con monitoreo durante la sesión.",
      "Pulsos de medicación": "Dosis programadas para controlar una crisis, indicadas y controladas por tu especialista.",
      "Medicamentos biotecnológicos":
        "Terapias biológicas e inhibidores JAK para enfermedades autoinmunes que no responden al tratamiento convencional.",
      "Monitoreo de adherencia": "Te acompañamos para que no pierdas dosis y resolvemos tus dudas entre sesiones.",
      "Gestión del riesgo e inmunizaciones":
        "Revisamos tus vacunas y controles antes y durante el tratamiento para reducir riesgos.",
    },
    relatedTreatments: ["terapias-biologicas"],
  },
  telemedicina: {
    intro:
      "Haz tus controles por videollamada desde tu casa u oficina, y combina la teleconsulta con la atención presencial cuando haga falta.",
    highlights: ["Receta e indicaciones digitales", "Sin traslados ni salas de espera", "Mismo especialista, misma historia"],
    serviceNotes: {
      Teleconsulta: "Consulta por videollamada con tu especialista, con receta e indicaciones en formato digital.",
      Teleinterconsulta: "Tu médico tratante y nuestro especialista revisan tu caso juntos, a distancia.",
      "Atención híbrida": "Alternamos visitas presenciales y teleconsultas según lo que necesite tu tratamiento.",
    },
    relatedTreatments: [],
  },
  procedimientos: {
    intro:
      "Procedimientos guiados por ecografía para tratar el dolor con precisión, en consultorio y sin hospitalización.",
    highlights: ["Guiados por imagen en tiempo real", "Ambulatorios: te vas el mismo día", "Menos pinchazos y molestias"],
    serviceNotes: {
      "Infiltraciones ecoguiadas por reumatólogo": "Tu reumatólogo aplica el medicamento viendo la articulación en tiempo real.",
      "Infiltraciones ecoguiadas por radiólogo":
        "Procedimientos guiados por imagen a cargo de nuestro radiólogo, cuando tu caso lo requiere.",
      Videocapilaroscopía: "Observa los pequeños vasos de la uña, sin agujas ni dolor, para orientar el diagnóstico.",
    },
    relatedTreatments: ["infiltraciones-ecoguiadas", "viscosuplementacion", "videocapilaroscopia"],
  },
  "consulta-externa": {
    intro: "Un equipo multidisciplinario trabaja sobre un mismo plan para tratar tu dolor desde todos los frentes.",
    highlights: ["Presencial o por teleconsulta", "Un plan compartido por todo el equipo", "Horario extendido"],
    serviceNotes: {
      Reumatología: "Diagnóstico y tratamiento de enfermedades de las articulaciones, los huesos y autoinmunes.",
      "Medicina general": "Evaluación integral y control de otras condiciones de salud que influyen en tu tratamiento.",
      Psicología: "Acompañamiento para manejar el dolor crónico, el estrés y el impacto emocional de la enfermedad.",
      Nutrición: "Plan de alimentación según tu condición, por ejemplo en gota, osteoporosis o control de peso.",
      "Terapia ocupacional": "Estrategias y adaptaciones para cuidar tus articulaciones en el trabajo y en casa.",
      "Terapia física": "Ejercicio terapéutico guiado para recuperar fuerza, movilidad y confianza.",
    },
    relatedTreatments: ["terapia-fisica"],
  },
};

export function getServiceDetail(slug: string): ServiceDetail {
  const detail = serviceDetails[slug];
  if (!detail) throw new Error(`Service detail not found: ${slug}`);
  return detail;
}
