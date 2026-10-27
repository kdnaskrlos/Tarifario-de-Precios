# Tarifario de Precios — memoria del proyecto

Léelo antes de tocar nada. Resume lo que el dueño (kdnaskrlos, Venezuela, hora de Caracas) quiere y cómo trabaja.

## Qué es
- Software de precios por volumen para prendas de vestir (franelas, buzos, joggers, bodies de bebé…), con lógica económica.
- PWA en GitHub Pages: https://kdnaskrlos.github.io/Tarifario-de-Precios/
- Todo en un solo archivo `index.html` (HTML + CSS + JS sin librerías), más `sw.js` y `manifest.webmanifest`.
- Dos vistas:
  - **Escritorio:** el tarifario completo (tabla editable, edición en lote, deshacer/rehacer, exportar CSV).
  - **Móvil (`html.movil`):** el cotizador con tarjetas, deslizar para borrar, panel inferior de totales y asistente con IA.
- Los datos viven en `datos.json`, cifrado con la clave del usuario (PBKDF2 250k + AES-GCM). "Guardar en GitHub" usa un token fine-grained que solo vive en el navegador. **Nunca** se suben tokens ni llaves al repo.

## Reglas de negocio (no cambiarlas sin que lo pida)
- Moneda: COP en todo.
- Margen saludable 20% (alerta si baja de ahí). Margen mínimo general 10%; los precios pueden bajar hasta ahí. No hay regla anti-acantilado.
- El gasto operativo es por prenda, no por pedido.
- Tramos: 1–5 (detal), 6–11, 12–23, 24–48, +49.
- Ajustes propios por producto, cada uno con aviso si choca con lo general:
  - `p.gop`: gasto operativo propio.
  - `p.flp`: margen mínimo propio.
  - `p.mp`: precios de tramo fijados a mano, con "Restablecer a precios del sistema".
  - `p.sep`: el producto cuenta por separado y no suma al mix del pedido.
- En el móvil, el mix suma las prendas para elegir el tramo, excepto las de productos por separado.

## Asistente con IA (móvil)
- Proveedores: OpenRouter (modelos `:free`, con cambio automático entre 3), Gemini y Groq.
- En Opciones hay una casilla por IA. Si hay varias marcadas, se les pregunta a la vez y gana la primera respuesta válida; si una falla, responde otra. Al menos una debe quedar marcada.
- Claude y la API de Anthropic **no** están disponibles en Venezuela; el usuario pidió quitar Claude. Gemini le ha fallado varias veces.
- Las preguntas sugeridas cambian al abrir el chat y al empezar una conversación nueva, y usan productos reales.

## Cómo trabajar con él
- Habla y responde **en español**, corto y claro, sin tecnicismos.
- **Cada cambio sube la versión:** `APP_VERSION` y `APP_DATE` en `index.html`, y `CACHE` en `sw.js` (por ejemplo `v64` → `v65`). La versión se ve en letras pequeñas al final de Opciones (móvil) y de la conexión con GitHub (escritorio).
- Después de cada cambio: probar con Playwright (vista móvil 360×780 y escritorio 1530 px), hacer commit y **push a `main`**. Antes del push haz `git fetch` y une conservando el `datos.json` y el `README.md` del remoto (él guarda precios desde la app).
- Suele pedir "vuelve a la versión anterior" cuando no le gusta un diseño: revierte con `git revert` y sube la versión.
- Cuida mucho el diseño móvil:
  - El texto no debe saltar de línea.
  - Los iconos van sin cajas.
  - El botón atrás del teléfono no debe cerrar la app: cierra ventanas, el chat o el campo de cantidad.
  - El scroll no debe moverse solo.
- Probado en Chrome para Android. El zoom de la interfaz usa CSS `zoom`; los gestos dividen por el factor `zf`.
