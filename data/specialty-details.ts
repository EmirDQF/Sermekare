import type { SpecialtyDetail } from "@/types/medical";

/**
 * Contenido de /especialidades/[slug]. PROVISIONAL: información general para pacientes;
 * validar con el equipo médico antes de publicar.
 */
export const specialtyDetails: Readonly<Record<string, SpecialtyDetail>> = {
  artrosis: {
    whoIsAffected:
      "Es más frecuente desde los 50 años, aunque puede aparecer antes por lesiones deportivas, sobrepeso o trabajos que exigen mucho a las articulaciones.",
    diagnosis: [
      "Conversación sobre tus síntomas y examen de la articulación.",
      "Ecografía en consultorio para ver el cartílago, el líquido y los tendones.",
      "Radiografía o análisis cuando hacen falta para descartar otras causas.",
    ],
    treatments: ["infiltraciones-ecoguiadas", "viscosuplementacion", "terapia-fisica"],
    faq: [
      {
        id: "artrosis-cura",
        question: "¿La artrosis tiene cura?",
        answer:
          "El cartílago desgastado no se regenera por completo, pero el dolor y la movilidad pueden mejorar mucho con ejercicio, control de peso y tratamientos como las infiltraciones.",
      },
      {
        id: "artrosis-ejercicio",
        question: "¿Debo dejar de hacer ejercicio?",
        answer: "No. El ejercicio adecuado protege la articulación; tu especialista y tu terapeuta te indican qué tipo y cuánto.",
      },
    ],
  },
  "artritis-reumatoide": {
    whoIsAffected:
      "Es más frecuente en mujeres y suele empezar entre los 30 y 50 años, aunque puede aparecer a cualquier edad.",
    diagnosis: [
      "Examen de las articulaciones y revisión de cuánto dura la rigidez por la mañana.",
      "Análisis de sangre como el factor reumatoide, los anticuerpos anti-CCP y los marcadores de inflamación.",
      "Ecografía para detectar inflamación que aún no se ve a simple vista.",
    ],
    treatments: ["terapias-biologicas", "laboratorio-y-densitometria", "terapia-fisica"],
    faq: [
      {
        id: "ar-hereditaria",
        question: "¿Es hereditaria?",
        answer:
          "Hay cierta predisposición familiar, pero tener un familiar con la enfermedad no significa que la vayas a desarrollar.",
      },
      {
        id: "ar-temprano",
        question: "¿Por qué es importante tratarla pronto?",
        answer:
          "Porque el tratamiento temprano ayuda a controlar la inflamación y a prevenir daños permanentes en las articulaciones.",
      },
    ],
  },
  gota: {
    whoIsAffected:
      "Es más común en hombres adultos y en mujeres después de la menopausia; influyen la genética, la alimentación, el alcohol y algunos medicamentos.",
    diagnosis: [
      "Historia de las crisis y examen de la articulación afectada.",
      "Medición del ácido úrico en sangre y otros análisis.",
      "Ecografía para buscar depósitos de cristales en la articulación.",
    ],
    treatments: ["laboratorio-y-densitometria", "infiltraciones-ecoguiadas"],
    faq: [
      {
        id: "gota-dieta",
        question: "¿Basta con la dieta para controlar la gota?",
        answer:
          "La alimentación ayuda, pero muchas personas además necesitan medicamentos para bajar el ácido úrico; tu especialista define el plan.",
      },
      {
        id: "gota-crisis",
        question: "¿Qué hago durante una crisis?",
        answer: "Reposa la articulación y consulta pronto para recibir el tratamiento de la crisis; evita automedicarte.",
      },
    ],
  },
  lupus: {
    whoIsAffected:
      "Afecta sobre todo a mujeres en edad fértil, aunque también puede presentarse en hombres, niños y adultos mayores.",
    diagnosis: [
      "Revisión de síntomas en distintos órganos: piel, articulaciones, riñones y otros.",
      "Análisis inmunológicos, como los anticuerpos antinucleares (ANA).",
      "Seguimiento periódico con análisis de sangre y orina.",
    ],
    treatments: ["laboratorio-y-densitometria", "terapias-biologicas", "videocapilaroscopia"],
    faq: [
      {
        id: "lupus-contagio",
        question: "¿El lupus es contagioso?",
        answer:
          "No. Es una enfermedad autoinmune: el propio sistema de defensa ataca al cuerpo, y no se transmite a otras personas.",
      },
      {
        id: "lupus-sol",
        question: "¿Puedo tomar sol?",
        answer:
          "Muchas personas con lupus son sensibles al sol: usa protector solar y consulta las recomendaciones para tu caso.",
      },
    ],
  },
  fibromialgia: {
    whoIsAffected:
      "Es más frecuente en mujeres entre los 30 y 60 años y suele asociarse a alteraciones del sueño, estrés o ansiedad.",
    diagnosis: [
      "Evaluación del dolor generalizado, el cansancio y la calidad del sueño.",
      "Análisis para descartar otras enfermedades con síntomas parecidos.",
      "Cuestionarios validados para medir el impacto en tu vida diaria.",
    ],
    treatments: ["terapia-fisica"],
    faq: [
      {
        id: "fibro-real",
        question: "¿El dolor de la fibromialgia es real?",
        answer: "Sí. Es un dolor real, relacionado con una mayor sensibilidad del sistema nervioso al dolor.",
      },
      {
        id: "fibro-ayuda",
        question: "¿Qué es lo que más ayuda?",
        answer:
          "Un plan combinado: ejercicio gradual, buen descanso, manejo del estrés y, en algunos casos, medicamentos.",
      },
    ],
  },
  osteoporosis: {
    whoIsAffected:
      "Es más frecuente en mujeres después de la menopausia y en adultos mayores, y en quienes usan corticoides por tiempo prolongado.",
    diagnosis: [
      "Densitometría ósea (DXA) para medir la densidad de tus huesos.",
      "Evaluación de fracturas vertebrales (VFA) cuando corresponde.",
      "Análisis de calcio, vitamina D y otros factores que afectan al hueso.",
    ],
    treatments: ["laboratorio-y-densitometria", "terapia-fisica"],
    faq: [
      {
        id: "osteo-dolor",
        question: "¿La osteoporosis duele?",
        answer:
          "Por lo general no da síntomas hasta que ocurre una fractura; por eso es importante detectarla a tiempo.",
      },
      {
        id: "osteo-prevenir",
        question: "¿Cómo se previene?",
        answer:
          "Con ejercicio, suficiente calcio y vitamina D, sin tabaco ni exceso de alcohol, y con controles cuando hay factores de riesgo.",
      },
    ],
  },
  espondiloartritis: {
    whoIsAffected:
      "Suele comenzar antes de los 45 años, con dolor lumbar que mejora con el movimiento y empeora con el reposo.",
    diagnosis: [
      "Historia del dolor de espalda y examen de la columna y las articulaciones.",
      "Análisis de sangre, incluido el marcador HLA-B27 cuando corresponde.",
      "Estudios de imagen para buscar inflamación en la pelvis y la columna.",
    ],
    treatments: ["terapias-biologicas", "terapia-fisica"],
    faq: [
      {
        id: "espondilo-comun",
        question: "¿Es lo mismo que un dolor de espalda común?",
        answer:
          "No. El dolor inflamatorio mejora al moverte y empeora en reposo o de madrugada; ese patrón merece una evaluación.",
      },
      {
        id: "espondilo-ejercicio",
        question: "¿El ejercicio ayuda?",
        answer: "Sí. El ejercicio regular es parte central del tratamiento para mantener la movilidad.",
      },
    ],
  },
};

export function getSpecialtyDetail(slug: string): SpecialtyDetail {
  const detail = specialtyDetails[slug];
  if (!detail) throw new Error(`Specialty detail not found: ${slug}`);
  return detail;
}
