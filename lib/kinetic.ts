export interface KineticWord {
  word: string;
  /** Parte de la palabra clave: se pinta con el gradiente teal animado. */
  accent: boolean;
}

function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/** Separa un titular en palabras para la tipografía cinética y marca las de la frase `accent`. */
export function splitKineticWords(text: string, accent?: string): KineticWord[] {
  const start = accent ? text.indexOf(accent) : -1;
  if (!accent || start === -1) return words(text).map((word) => ({ word, accent: false }));
  const before = words(text.slice(0, start)).map((word) => ({ word, accent: false }));
  const highlighted = words(accent).map((word) => ({ word, accent: true }));
  const after = words(text.slice(start + accent.length)).map((word) => ({ word, accent: false }));
  return [...before, ...highlighted, ...after];
}
