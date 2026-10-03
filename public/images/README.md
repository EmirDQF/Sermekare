# Fotos de SERMEKARE — qué foto real va en cada lugar

Todas las imágenes actuales son **PROVISIONALES** (Unsplash, servidas vía `next/image` con `remotePatterns`).
Antes de publicar, reemplázalas por fotos propias de la clínica (con autorización de las personas que aparecen).

Para usar fotos locales: guárdalas en esta carpeta (`public/images/`) y cambia la URL en el archivo indicado
por la ruta local, por ejemplo `/images/hero-medica.jpg`.

| Lugar en la web | Archivo con la URL | Foto real recomendada |
| --- | --- | --- |
| Hero (Home) | `data/home.ts` → `homeImages.hero` | Retrato vertical de un(a) reumatólogo(a) del staff, fondo claro, sonriendo, buena luz. Mín. 1000 px de ancho. |
| "Así es tu atención" | `data/home.ts` → `homeImages.careJourney` | Médico conversando con un paciente (idealmente adulto mayor con su hijo/a) en el consultorio. |
| Comparador guiada vs a ciegas | `data/home.ts` → `homeImages.guided` | Pantalla del ecógrafo durante una infiltración ecoguiada real (sin datos del paciente visibles). |
| Banda de telemedicina | `data/home.ts` → `homeImages.telemedicine` | Captura (simulada) de una teleconsulta: especialista frente a la cámara. |
| Miniatura del video | `data/home.ts` → `homeImages.video` | Fotograma del video institucional sobre dolor de rodilla / artrosis. |
| Tarjetas del staff médico | `data/doctors.ts` → `photo` de cada médico | Retrato profesional de cada médico, mismo fondo y encuadre para todos (relación 4:4.4). |
| Portadas del blog | `data/home.ts` → `blogPosts[].cover` | Foto alusiva a cada artículo (16:10). |

Notas:

- No uses fotos de pacientes reales sin consentimiento informado por escrito.
- Exporta en JPG/WebP de buena calidad; Next.js genera AVIF/WebP optimizados automáticamente.
- El texto alternativo (`*Alt`) de cada foto está junto a su URL: actualízalo si cambias la imagen.
