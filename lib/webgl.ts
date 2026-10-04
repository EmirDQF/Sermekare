let cached: boolean | null = null;

/** true si el navegador puede crear un contexto WebGL. Se evalúa una sola vez y se libera el contexto de prueba. */
export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    cached = gl !== null;
  } catch {
    cached = false;
  }
  return cached;
}
