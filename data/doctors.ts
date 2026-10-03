import type { Doctor } from "@/types/medical";

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;

// PROVISIONAL: médicos ficticios. Reemplazar por el staff real (nombre, CMP, RNE, foto y horarios).
export const doctors: readonly Doctor[] = [
  {
    slug: "valeria-quintana",
    name: "Dra. Valeria Quintana Ríos",
    title: "Médica reumatóloga",
    specialty: "Reumatología · Ecografía musculoesquelética",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 14,
    education: [
      "Médica cirujana, universidad peruana (provisional)",
      "Residencia en Reumatología, hospital nacional de Lima (provisional)",
      "Diplomado en Ecografía Musculoesquelética (provisional)",
    ],
    focus: ["Artrosis", "Infiltraciones ecoguiadas", "Dolor de rodilla y hombro"],
    photo: unsplash("1594824476967-48c8b964273f"),
    photoAlt: "Dra. Valeria Quintana, reumatóloga, con uniforme clínico y brazos cruzados",
    schedule: [
      { day: "Lunes y miércoles", hours: "8:00 a.m. – 1:00 p.m.", modality: "presencial" },
      { day: "Viernes", hours: "3:00 p.m. – 8:00 p.m.", modality: "ambas" },
    ],
    provisional: true,
  },
  {
    slug: "martin-salazar",
    name: "Dr. Martín Salazar Vega",
    title: "Médico reumatólogo",
    specialty: "Reumatología · Terapias biológicas",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 12,
    education: [
      "Médico cirujano, universidad peruana (provisional)",
      "Residencia en Reumatología (provisional)",
      "Fellow en Enfermedades Autoinmunes (provisional)",
    ],
    focus: ["Artritis reumatoide", "Espondiloartritis", "Terapia biológica e inhibidores JAK"],
    photo: unsplash("1612349317150-e413f6a5b16d"),
    photoAlt: "Dr. Martín Salazar, reumatólogo, con bata blanca y estetoscopio",
    schedule: [
      { day: "Martes y jueves", hours: "2:00 p.m. – 8:00 p.m.", modality: "presencial" },
      { day: "Sábado", hours: "8:00 a.m. – 1:00 p.m.", modality: "teleconsulta" },
    ],
    provisional: true,
  },
  {
    slug: "carmen-ugarte",
    name: "Dra. Carmen Ugarte Llosa",
    title: "Médica reumatóloga",
    specialty: "Reumatología · Osteoporosis y lupus",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 18,
    education: [
      "Médica cirujana, universidad peruana (provisional)",
      "Residencia en Reumatología (provisional)",
      "Especialización en Densitometría Clínica (provisional)",
    ],
    focus: ["Osteoporosis", "Lupus", "Gota", "Salud ósea del adulto mayor"],
    photo: unsplash("1559839734-2b71ea197ec2"),
    photoAlt: "Dra. Carmen Ugarte, reumatóloga, sonriendo con bata blanca al aire libre",
    schedule: [
      { day: "Lunes a jueves", hours: "3:00 p.m. – 8:00 p.m.", modality: "ambas" },
    ],
    provisional: true,
  },
  {
    slug: "diego-paredes",
    name: "Dr. Diego Paredes Huamán",
    title: "Médico especialista en Medicina Física y Rehabilitación",
    specialty: "Rehabilitación · Dolor crónico y lesiones deportivas",
    cmp: "00000",
    rne: "00000",
    yearsOfExperience: 10,
    education: [
      "Médico cirujano, universidad peruana (provisional)",
      "Residencia en Medicina Física y Rehabilitación (provisional)",
      "Curso en Medicina del Deporte (provisional)",
    ],
    focus: ["Fibromialgia", "Dolor lumbar y cervical", "Lesiones en corredores"],
    photo: unsplash("1622253692010-333f2da6031d"),
    photoAlt: "Dr. Diego Paredes, especialista en rehabilitación, sonriendo con uniforme azul",
    schedule: [
      { day: "Lunes a viernes", hours: "8:00 a.m. – 2:00 p.m.", modality: "presencial" },
      { day: "Sábado", hours: "9:00 a.m. – 1:00 p.m.", modality: "ambas" },
    ],
    provisional: true,
  },
];

export function getDoctor(slug: string): Doctor {
  const doctor = doctors.find((d) => d.slug === slug);
  if (!doctor) throw new Error(`Doctor not found: ${slug}`);
  return doctor;
}
