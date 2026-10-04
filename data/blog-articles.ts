import type { BlogArticle } from "@/types/medical";

/**
 * Cuerpo de los artículos del blog (los metadatos viven en data/home.ts → blogPosts).
 * PROVISIONAL: textos de divulgación general; validar con el equipo médico antes de publicar.
 */
export const blogArticles: Readonly<Record<string, BlogArticle>> = {
  "infiltraciones-guiadas-vs-a-ciegas": {
    intro:
      "Una infiltración consiste en aplicar un medicamento directamente en una articulación, un tendón o una bursa. La gran diferencia está en cómo se dirige la aguja: a ciegas, guiándose solo por referencias externas, o viendo el interior con ecografía.",
    sections: [
      {
        heading: "¿Qué es una infiltración a ciegas?",
        paragraphs: [
          "El médico ubica el punto de entrada palpando relieves del hueso y la piel. En articulaciones grandes y superficiales puede funcionar, pero en zonas pequeñas, profundas o inflamadas es más difícil asegurar que el medicamento llegue al lugar exacto.",
        ],
      },
      {
        heading: "¿Qué cambia con la ecografía?",
        paragraphs: [
          "La ecografía muestra en tiempo real los tendones, el líquido y el cartílago. Así el especialista sigue el recorrido de la aguja en la pantalla y deposita el medicamento donde se necesita.",
        ],
        bullets: [
          "Más precisión en articulaciones pequeñas o profundas.",
          "Menos pinchazos y menos molestias.",
          "Queda registro en imagen para comparar en tus controles.",
        ],
      },
      {
        heading: "¿Para quién está indicada?",
        paragraphs: [
          "Suele indicarse cuando el dolor de rodilla, hombro, cadera o mano no mejora con el tratamiento inicial. Tu especialista evalúa si es adecuada para ti y con qué medicamento.",
        ],
      },
      {
        heading: "Después del procedimiento",
        paragraphs: [
          "Es un procedimiento ambulatorio: te vas caminando el mismo día. Conviene evitar esfuerzos intensos uno o dos días y consultar si aparece fiebre o una hinchazón importante.",
        ],
      },
    ],
    takeaway:
      "Ver la articulación mientras se trata aporta precisión. Pregúntale a tu especialista si una infiltración ecoguiada es una opción para tu caso.",
  },
  "dolor-lumbar-trabajo-oficina": {
    intro:
      "Pasar muchas horas sentado frente a la computadora es una de las causas más comunes de dolor lumbar. La mayoría de las veces es un dolor mecánico que mejora con cambios simples, pero hay señales que conviene no pasar por alto.",
    sections: [
      {
        heading: "Por qué duele la espalda en la oficina",
        paragraphs: [
          "Mantener la misma postura por mucho tiempo sobrecarga los músculos y las articulaciones de la columna. La falta de movimiento y una silla o pantalla mal ubicadas empeoran el problema.",
        ],
      },
      {
        heading: "Cambios que ayudan desde hoy",
        paragraphs: ["Pequeños ajustes en tu jornada pueden hacer una gran diferencia:"],
        bullets: [
          "Levántate y camina unos minutos cada hora.",
          "Pantalla a la altura de los ojos y pies apoyados en el piso.",
          "Haz pausas activas con estiramientos suaves.",
          "Mantén actividad física regular fuera del trabajo.",
        ],
      },
      {
        heading: "5 señales para consultar",
        paragraphs: ["Busca una evaluación si notas alguna de estas situaciones:"],
        bullets: [
          "El dolor dura más de 4 a 6 semanas.",
          "Te despierta por la noche o empeora en reposo.",
          "Tienes rigidez matinal de más de 30 minutos.",
          "Sientes hormigueo, adormecimiento o debilidad en las piernas.",
          "Aparece fiebre o una baja de peso sin explicación.",
        ],
      },
      {
        heading: "Cómo te ayudamos",
        paragraphs: [
          "Evaluamos tu historia y tu postura, descartamos causas inflamatorias como la espondiloartritis y armamos un plan de ejercicio terapéutico adaptado a tu trabajo.",
        ],
      },
    ],
    takeaway:
      "El dolor postural tiene solución, pero el dolor que despierta de noche o que no cede merece una evaluación especializada.",
  },
  "lesiones-en-corredores": {
    intro:
      "Correr es una gran forma de cuidar tu salud, pero aumentar la distancia o el ritmo demasiado rápido puede terminar en lesión. Reconocer las molestias a tiempo evita que se vuelvan crónicas.",
    sections: [
      {
        heading: "Las lesiones más frecuentes",
        paragraphs: ["En corredores aficionados vemos con frecuencia:"],
        bullets: [
          "Dolor en la parte delantera de la rodilla.",
          "Molestias en el tendón de Aquiles.",
          "Fascitis plantar: dolor en el talón al dar los primeros pasos.",
        ],
      },
      {
        heading: "Cuándo parar",
        paragraphs: [
          "Si el dolor te obliga a cambiar tu forma de correr, aparece cada vez antes o persiste al día siguiente, es momento de detenerte y consultar. Seguir corriendo con dolor suele alargar la recuperación.",
        ],
      },
      {
        heading: "Cómo diagnosticamos",
        paragraphs: [
          "Con ecografía en el mismo consultorio podemos ver el tendón o la fascia afectados y definir el tratamiento sin esperar otros estudios en la mayoría de los casos.",
        ],
      },
      {
        heading: "Volver a correr con seguridad",
        paragraphs: [
          "La vuelta debe ser progresiva, con ejercicios de fuerza y movilidad, y aumentando la carga poco a poco según la respuesta de tu cuerpo.",
        ],
      },
    ],
    takeaway: "Escuchar las molestias a tiempo es la mejor forma de seguir corriendo por muchos años.",
  },
  "dolor-de-cuello": {
    intro:
      "El dolor de cuello es muy común en personas que trabajan con computadora o celular. Suele relacionarse con la postura y el estrés, pero algunas señales indican que hay que consultar pronto.",
    sections: [
      {
        heading: "Postura y estrés",
        paragraphs: [
          "Inclinar la cabeza hacia adelante por mucho tiempo y la tensión acumulada durante el día sobrecargan los músculos del cuello y los hombros.",
        ],
      },
      {
        heading: "Ejercicios y pausas activas",
        paragraphs: ["Algunas recomendaciones simples para tu día a día:"],
        bullets: [
          "Ubica la pantalla a la altura de los ojos.",
          "Haz movimientos suaves del cuello cada hora.",
          "Evita sostener el teléfono entre el hombro y la oreja.",
          "Cuida tu descanso y tu almohada.",
        ],
      },
      {
        heading: "Señales de alerta",
        paragraphs: ["Consulta sin demora si notas:"],
        bullets: [
          "Hormigueo o debilidad en los brazos.",
          "Dolor que te despierta por la noche.",
          "Dolor después de una caída o un golpe.",
        ],
      },
    ],
    takeaway:
      "La mayoría de los dolores de cuello mejora con pausas y ejercicio, pero el hormigueo o la debilidad en los brazos requieren evaluación.",
  },
  "caidas-en-el-adulto-mayor": {
    intro:
      "Una caída puede cambiar la vida de una persona mayor, sobre todo si sus huesos están debilitados por la osteoporosis. La buena noticia es que muchas caídas y fracturas se pueden prevenir.",
    sections: [
      {
        heading: "Osteoporosis: un riesgo silencioso",
        paragraphs: [
          "La osteoporosis no suele dar síntomas hasta que ocurre una fractura. Por eso se recomienda evaluar la salud ósea en mujeres desde los 65 años, en hombres desde los 70 y antes si hay factores de riesgo.",
        ],
      },
      {
        heading: "La densitometría ósea",
        paragraphs: [
          "Es una prueba rápida e indolora que mide la densidad de los huesos con rayos X de dosis muy baja. Permite detectar el problema a tiempo y decidir el tratamiento.",
        ],
      },
      {
        heading: "Cambios en casa que reducen el riesgo",
        paragraphs: ["Algunas medidas sencillas:"],
        bullets: [
          "Buena iluminación, también de noche camino al baño.",
          "Retirar alfombras sueltas y cables del paso.",
          "Barras de apoyo en la ducha y junto al inodoro.",
          "Calzado cerrado y antideslizante.",
        ],
      },
      {
        heading: "Ejercicio y controles",
        paragraphs: [
          "El ejercicio de fuerza y equilibrio, una revisión de los medicamentos que causan mareos y los controles de la vista también ayudan a prevenir caídas.",
        ],
      },
    ],
    takeaway:
      "Cuidar los huesos de tus padres empieza con una evaluación a tiempo: la densitometría y la consulta pueden hacerse en una sola visita.",
  },
  "gota-y-dieta": {
    intro:
      "La gota se produce cuando el ácido úrico forma cristales en las articulaciones. La alimentación influye, pero no es lo único: muchas personas también necesitan tratamiento para controlar el ácido úrico.",
    sections: [
      {
        heading: "Mitos y verdades",
        paragraphs: [
          "No todo depende de la dieta: la genética y el funcionamiento de los riñones tienen un papel importante. Aun así, algunos hábitos pueden desencadenar crisis.",
        ],
      },
      {
        heading: "Qué conviene moderar",
        paragraphs: ["Suele recomendarse limitar:"],
        bullets: [
          "Bebidas alcohólicas, sobre todo la cerveza.",
          "Bebidas azucaradas con fructosa.",
          "Vísceras y algunos mariscos en exceso.",
        ],
      },
      {
        heading: "Qué ayuda",
        paragraphs: ["Algunos hábitos favorables:"],
        bullets: [
          "Tomar suficiente agua durante el día.",
          "Mantener un peso saludable de forma gradual.",
          "Seguir el tratamiento indicado aunque no tengas dolor.",
        ],
      },
      {
        heading: "El papel del tratamiento",
        paragraphs: [
          "Cuando las crisis se repiten o aparecen tofos, tu especialista puede indicar medicamentos para bajar el ácido úrico, junto con orientación nutricional.",
        ],
      },
    ],
    takeaway:
      "La dieta ayuda, pero el control de la gota se logra con un plan completo y un seguimiento cercano con tu especialista.",
  },
};

export function getBlogArticle(slug: string): BlogArticle {
  const article = blogArticles[slug];
  if (!article) throw new Error(`Blog article not found: ${slug}`);
  return article;
}
