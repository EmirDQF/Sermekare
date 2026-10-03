import type { BodyZone, BodyZoneId } from "@/types/medical";

export const bodyZones: readonly BodyZone[] = [
  {
    id: "cuello",
    label: "Cuello",
    possibleCauses: "Tensión postural por trabajo de oficina, artrosis cervical o, con menos frecuencia, inflamación de la columna.",
    alertSigns: ["Hormigueo o debilidad en brazos", "Dolor que despierta de noche", "Dolor tras una caída o golpe"],
    approach: "Evaluación postural, ecografía si es necesario y terapia física con pausas activas para tu jornada.",
    specialtySlug: "fibromialgia",
    doctorSlug: "diego-paredes",
  },
  {
    id: "hombros",
    label: "Hombros",
    possibleCauses: "Tendinitis del manguito rotador, bursitis o desgaste de la articulación.",
    alertSigns: ["No puedes levantar el brazo", "Dolor nocturno al acostarte de lado", "Pérdida de fuerza"],
    approach: "Ecografía en consultorio para ver el tendón y, si corresponde, infiltración ecoguiada más rehabilitación.",
    specialtySlug: "artrosis",
    doctorSlug: "valeria-quintana",
  },
  {
    id: "manos",
    label: "Manos y muñecas",
    possibleCauses: "Artritis reumatoide, artrosis de manos, túnel carpiano o lupus.",
    alertSigns: ["Rigidez matinal de más de 30 minutos", "Dedos hinchados como salchicha", "Dedos que cambian de color con el frío"],
    approach: "Laboratorio inmunológico, ecografía y videocapilaroscopía para un diagnóstico temprano.",
    specialtySlug: "artritis-reumatoide",
    doctorSlug: "martin-salazar",
  },
  {
    id: "espalda",
    label: "Espalda y columna",
    possibleCauses: "Dolor lumbar mecánico por postura, espondiloartritis o fractura vertebral por osteoporosis.",
    alertSigns: ["Dolor que mejora al moverte y empeora en reposo", "Dolor de madrugada", "Pérdida de estatura"],
    approach: "Historia clínica detallada, estudios dirigidos y plan de ejercicio terapéutico.",
    specialtySlug: "espondiloartritis",
    doctorSlug: "martin-salazar",
  },
  {
    id: "cadera",
    label: "Cadera",
    possibleCauses: "Artrosis de cadera, bursitis o tendinopatía glútea.",
    alertSigns: ["Cojera", "Dolor en la ingle al caminar", "Dificultad para ponerte medias o zapatos"],
    approach: "Ecografía, infiltración ecoguiada cuando está indicada y fortalecimiento muscular.",
    specialtySlug: "artrosis",
    doctorSlug: "valeria-quintana",
  },
  {
    id: "rodillas",
    label: "Rodillas",
    possibleCauses: "Artrosis, lesiones deportivas, desgaste de menisco o inflamación por gota.",
    alertSigns: ["Rodilla hinchada y caliente", "Se traba o falla al caminar", "Dolor al subir escaleras que no cede"],
    approach: "Ecografía en consultorio, infiltraciones o viscosuplementación ecoguiadas y rehabilitación.",
    specialtySlug: "artrosis",
    doctorSlug: "valeria-quintana",
  },
  {
    id: "pies",
    label: "Pies y tobillos",
    possibleCauses: "Gota (frecuente en el dedo gordo), fascitis plantar o artritis.",
    alertSigns: ["Dolor súbito con enrojecimiento", "Dolor en el talón al dar los primeros pasos", "Hinchazón de tobillos"],
    approach: "Confirmación diagnóstica, control de la crisis y plan para prevenir nuevos episodios.",
    specialtySlug: "gota",
    doctorSlug: "carmen-ugarte",
  },
];

export function getBodyZone(id: BodyZoneId): BodyZone {
  const zone = bodyZones.find((z) => z.id === id);
  if (!zone) throw new Error(`Body zone not found: ${id}`);
  return zone;
}
