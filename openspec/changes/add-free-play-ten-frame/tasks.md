## 1. Base del proyecto

- [x] 1.1 Crear la base del proyecto con Vite + Svelte 5 + TypeScript en la raíz del repo
- [x] 1.2 Configurar ESLint, Prettier y `svelte-check`, con scripts `lint`, `format` y `check`
- [x] 1.3 Configurar Vitest (script `test`) y Playwright con proyectos WebKit iPad vertical y apaisado (script `test:e2e`)
- [x] 1.4 Rellenar la sección de comandos de `CLAUDE.md` (tests, lint, build) y el nombre del proyecto

## 2. Núcleo de lógica

- [x] 2.1 Implementar `src/core/tenFrame.ts`: `count` en [0,10], `add()` y `remove()` que devuelven eventos (`changed`, `reachedFull`, `blockedFull`, `blockedEmpty`)
- [x] 2.2 Implementar el helper de ocupación de huecos (huecos 1..N ocupados, orden fila superior → inferior)
- [x] 2.3 Tests unitarios del núcleo: añadir, quitar, límites 0/10, evento al llegar a 10 y orden de huecos
- [x] 2.4 Crear el store de sesión con runes (`$state`): cantidad, fruta seleccionada y voz on/off

## 3. Escena de juego (UI)

- [x] 3.1 Pantalla inicial "¡A jugar!" que da paso a la escena con 0 frutas
- [x] 3.2 Componente `TenFrame` (2×5) que pinta las frutas según los huecos ocupados
- [x] 3.3 Botones ➕ y ➖ grandes (≥120×120 px), con colores distintos y estado desactivado en los límites
- [x] 3.4 Número escrito grande, sincronizado con la cantidad, con animación de cambio
- [x] 3.5 Animaciones de entrada (cae) y salida (rueda) con transiciones de Svelte, interrumpibles
- [x] 3.6 Celebración visual al pasar de 9 a 10
- [x] 3.7 SVG de frutas (manzana, plátano, fresa, naranja) y control de adulto para elegir la fruta
- [x] 3.8 Resaltado secuencial de frutas durante el conteo al tocar una fruta
- [x] 3.9 Layout responsivo para iPad vertical y apaisado, con controles de adulto agrupados en una esquina

## 4. Audio

- [x] 4.1 Generar audios provisionales TTS (`0..10.m4a`, `full.m4a`, `empty.m4a`) en `public/audio/es/` y su `manifest.ts`
- [x] 4.2 Implementar `AudioService` con Web Audio API: desbloqueo en el gesto inicial, precarga a buffers y voz única que corta la anterior
- [x] 4.3 Cola cancelable de conteo 1..N sincronizada con el resaltado de frutas
- [x] 4.4 Conectar los eventos del núcleo con el AudioService (número, celebración y frase amable en 0)
- [x] 4.5 Control de adulto para silenciar la voz, que bloquea toda reproducción
- [x] 4.6 Reanudar el `AudioContext` en `visibilitychange` y en toques si está suspendido
- [x] 4.7 Exponer `window.__audioLog` solo en modo test, y tests unitarios de la cola y la cancelación

## 5. Shell PWA para iPad

- [x] 5.1 Configurar vite-plugin-pwa (`generateSW`, `autoUpdate`) con precache de JS, CSS, SVG y m4a
- [x] 5.2 Manifiesto, iconos, `apple-touch-icon` y metas de iOS para pantalla completa
- [x] 5.3 Meta viewport y CSS global anti-gestos (`touch-action`, `user-select`, `touch-callout`, `overscroll-behavior`, body fijo)
- [x] 5.4 Bloquear `gesturestart` (pellizco) y poner `draggable="false"` en las imágenes
- [x] 5.5 Configurar el despliegue estático con HTTPS (GitHub Pages con GitHub Actions) y el `base` de Vite

## 6. Documentación

- [x] 6.1 README: desarrollo, tests, despliegue, instalación en iPad, Acceso Guiado y cómo sustituir los audios por grabaciones propias

## 7. Verificación de Criterios de Aceptación

- [x] 7.1 Verificar **CA1**: con N < 10, ➕ muestra N+1 frutas, el número N+1 y suena su audio (e2e WebKit iPad)
- [x] 7.2 Verificar **CA2**: con N > 0, ➖ muestra N−1 frutas, el número N−1 y suena su audio (e2e)
- [x] 7.3 Verificar **CA3**: con 10 frutas, ➕ está desactivado y aparece la celebración al llegar a 10 (e2e + unit)
- [x] 7.4 Verificar **CA4**: con 0 frutas, ➖ está desactivado y suena la frase amable sin cambiar la cantidad (e2e + unit)
- [x] 7.5 Verificar **CA5**: los huecos se ocupan en orden fijo (unit + e2e con 7 frutas)
- [x] 7.6 Verificar **CA6**: tocar una fruta cuenta de 1 a N (e2e con `__audioLog`)
- [x] 7.7 Verificar **CA7**: con la voz silenciada no suena audio y el resto del comportamiento se mantiene (e2e)
- [x] 7.8 Verificar **CA8**: cambiar de fruta sustituye todas sin alterar la cantidad (e2e)
- [ ] 7.9 Verificar **CA9**: funcionamiento offline (e2e: precache en WebKit + recarga sin red en Chromium con perfil iPad, porque el WebKit de Playwright no permite recargar sin red; falta la prueba manual en iPad en modo avión)
- [ ] 7.10 Verificar **CA10**: sin zoom por doble toque ni menú contextual (comprobación automática de estilos y metas + prueba manual en iPad real)
- [x] 7.11 Verificar **CA11**: la pantalla inicial "¡A jugar!" da paso a la escena con 0 frutas y el audio habilitado (e2e)
- [ ] 7.12 Cumplir la **Definition of Done** de design.md
