## Context

El repositorio solo contiene la configuración de OpenSpec, así que este cambio crea la aplicación desde cero. La usuaria final es una niña de 3 años que no lee y juega en un **iPad** (Safari para iPadOS o PWA instalada), a veces sola y a veces acompañada de un adulto. El adulto grabará después su propia voz para los audios.

Restricciones de la plataforma que condicionan el diseño:
- **Autoplay de iOS:** no suena ningún audio hasta un gesto del usuario.
- **Latencia de `<audio>` en iOS:** es perceptible, y la locución debe ir sincronizada con el toque.
- **Gestos del sistema:** zoom por doble toque, menú por pulsación larga y rebote de scroll.
- **Service worker:** solo funciona con HTTPS.

## Goals / Non-Goals

**Goals:**
- Juego libre de suma y resta 0–10 con marco de diez, número escrito y voz (CA1–CA8, CA11).
- PWA instalable y 100 % offline en iPad (CA9).
- Interacción robusta ante toques infantiles (CA10).
- Núcleo de lógica independiente de la UI y testeable de forma unitaria.
- Audios sustituibles sin tocar código.

**Non-Goals:**
- Retos o preguntas ("¿cuántas hay?", "pon N"): incremento 2.
- Ecuación simbólica "3 + 1 = 4".
- Persistencia de progreso, cuentas de usuario, analítica o backend.
- Soporte optimizado para escritorio o Android (debe funcionar, pero no es objetivo).
- Grabación de audio dentro de la app.

## Decisions

### D1. Stack: Svelte 5 + Vite + TypeScript
Las transiciones integradas de Svelte (`fly`, `scale`, `spring`) cubren las animaciones de entrada y salida de frutas sin dependencias extra, y el bundle es mínimo.
- *Alternativas:* React + Motion (más peso y una librería extra para animar), Vanilla TS (se complica al añadir los retos), Phaser/PixiJS (canvas: difícil verificar los CA con DOM y excesivo para 10 objetos).

### D2. Arquitectura en tres capas
```
UI (Svelte)  ──acciones──▶  Núcleo (TS puro)  ──eventos──▶  AudioService
     ▲                         │ count, add(), remove()          │ Web Audio
     └──────── estado ─────────┘ eventos: changed/full/empty      ▼ 🔊
```
- **Núcleo** (`src/core/tenFrame.ts`): estado `count ∈ [0,10]`, `add()` y `remove()`, que devuelven un evento (`changed`, `reachedFull`, `blockedEmpty`, `blockedFull`). Sin dependencias de DOM. Concentra CA1–CA5 y se prueba con Vitest.
- **Store** (Svelte 5 runes, `$state`): envuelve el núcleo y guarda las preferencias de sesión (fruta, voz on/off).
- **AudioService** (`src/audio/`): reacciona a los eventos. La UI nunca reproduce audio directamente.
- *Alternativa descartada:* lógica dentro de los componentes. Haría los CA difíciles de testear sin navegador.

### D3. Audio con Web Audio API y buffers precargados
Al pulsar "¡A jugar!" se crea o reanuda el `AudioContext` dentro del gesto y se decodifican todos los audios en `AudioBuffer`s. Cada reproducción usa un `AudioBufferSourceNode`, con latencia prácticamente nula. Una única "voz" activa: un nuevo audio detiene el anterior. El conteo de 1 a N es una cola cancelable.
- *Alternativas:* `HTMLAudioElement` (latencia y límites de reproducción simultánea en iOS), Howler.js (válido, pero añade dependencia para algo que son ~60 líneas).

### D4. Catálogo de audios con nombres estables
`public/audio/es/{0..10}.m4a`, `full.m4a`, `empty.m4a` y un `manifest.ts` que los enumera. Formato AAC (.m4a), nativo en iOS y ligero. Los provisionales se generan con TTS (p. ej. `say -v Mónica` en macOS) y se sustituyen por grabaciones con el mismo nombre.
- *Alternativa descartada:* Web Speech API en tiempo de ejecución, con calidad desigual entre dispositivos y dependencia de las voces instaladas.

### D5. Frutas como SVG propios
Ilustraciones SVG sencillas (manzana, plátano, fresa, naranja) en `src/assets/fruits/`. Se ven nítidas en Retina, pesan poco y se cachean fácilmente.
- *Alternativa descartada:* emoji. Su aspecto depende del sistema y no se pueden animar con detalle ni ajustar su contraste.

### D6. PWA con vite-plugin-pwa (Workbox, `generateSW`)
Precache de todo el build, audios incluidos (`globPatterns` con `m4a` y `svg`). Manifiesto con `display: "fullscreen"` (iOS cae a `standalone`), `apple-touch-icon` y `apple-mobile-web-app-capable`. Actualización `autoUpdate`.

### D7. Control de gestos
- `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">`
- CSS global: `touch-action: manipulation` (elimina el zoom por doble toque sin bloquear los toques), `user-select: none`, `-webkit-user-select: none`, `-webkit-touch-callout: none`, `overscroll-behavior: none`, `html, body { position: fixed; overflow: hidden; }`.
- Listener de `gesturestart` con `preventDefault()` para bloquear el pellizco (Safari ignora `user-scalable=no` desde iOS 10).
- Imágenes con `draggable="false"` y `pointer-events` gestionados por su contenedor.
- Recomendación operativa (fuera del código): **Acceso Guiado** de iPadOS.

### D8. Estrategia de tests
- **Vitest:** núcleo (CA1–CA5) y la cola o cancelación del AudioService con un `AudioContext` simulado.
- **Playwright** con proyecto `webkit` y dispositivo `iPad (gen 7)` (y uno apaisado). Los toques sobre botones con `aria-disabled` se fuerzan, porque Playwright no hace clic en ellos y la spec exige que respondan: CA1–CA8 y CA11 contra la app servida con `vite preview`. El audio se verifica espiando el `AudioService` (expuesto en `window.__audioLog` solo en modo test).
- **CA9 (offline):** en WebKit se verifica que el service worker controla la página y que la caché contiene todos los recursos (audios incluidos). La recarga real sin red se prueba en un proyecto **Chromium con perfil iPad**, porque el WebKit de Playwright falla al recargar sin red aunque el service worker tenga la respuesta. Se completa con una prueba manual en un iPad real en modo avión.
- **CA10 (gestos):** se comprueban automáticamente los estilos y metas aplicados, y la ausencia de zoom y menú se verifica manualmente en un iPad real, ya que Playwright no emula los gestos nativos de Safari.

### D9. Despliegue
Build estático en **GitHub Pages**, con HTTPS de serie, desplegado con GitHub Actions. `base` de Vite configurable según la ruta del repositorio.

## Risks / Trade-offs

- [El `AudioContext` se suspende al pasar a segundo plano o bloquear el iPad] → Llamar a `resume()` en `visibilitychange` y en cada toque si `state !== "running"`.
- [Las animaciones solapadas con toques muy rápidos desincronizan el marco] → El estado es la única fuente de verdad. Las animaciones son cosméticas y se interrumpen, nunca encolan cambios.
- [Safari puede ignorar alguna supresión de gestos en futuras versiones] → Verificación manual en iPad real dentro de la DoD, y Acceso Guiado como respaldo.
- [Las cachés de PWA en iOS pueden purgarse si no se usa la app en semanas] → Aceptable: se recarga al volver a tener red. Se documenta en el README.
- [Los audios provisionales TTS suenan poco cálidos] → Temporal por diseño (D4). Se sustituyen sin cambios de código.
- [La verificación de CA9 y CA10 no es 100 % automatizable] → Checklist manual explícito en tasks.md, con la evidencia anotada en el PR.

## Open Questions

Resueltas:
- Celebración: se muestra **cada vez** que se pasa de 9 a 10 (sustituye a "solo la primera vez" del borrador de INN-12).
- Frutas de la primera versión: manzana, plátano, fresa y naranja.
- Hosting: GitHub Pages.

## Definition of Done (técnica)

- [x] Tests automatizados cubren cada Criterio de Aceptación del proposal (CA9 y CA10 con verificación manual complementaria en iPad real)
- [x] Lint / formato / typecheck en verde (`svelte-check`, ESLint, Prettier)
- [x] `openspec validate --strict` sin errores
- [x] Documentación actualizada: README con desarrollo, tests, despliegue, cómo sustituir audios e instalación en iPad; comandos en `CLAUDE.md`
- [x] PR en GitHub enlazado al issue de Linear INN-12
- [x] Probado en un iPad real como PWA instalada (online y en modo avión)
