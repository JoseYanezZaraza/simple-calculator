> **Linear:** [INN-12](https://linear.app/inno8/issue/INN-12/incremento-1-juego-libre-con-marco-de-diez-sumar-y-restar-0-10) · Proyecto [P-INN-2](https://linear.app/inno8/project/calculadora-interactiva-infantil-952da72f318f) · **Estado:** Implementado (PR #1)

## Why

Una niña de 3 años aún no lee ni maneja símbolos (`+`, `=`), pero sí entiende "llega una más" y "se fue una" con objetos concretos. Necesitamos una app web interactiva para iPad en la que descubra la suma y la resta de 0 a 10 manipulando frutas, viendo el número escrito y oyendo la cantidad, sin errores ni puntuaciones. Este es el primer incremento: el juego libre, sobre el que se construirán los retos.

## What Changes

- Nueva app web (proyecto vacío hasta ahora): Svelte 5 + Vite + TypeScript, instalable como PWA en iPad.
- Pantalla inicial "¡A jugar!" que, con el primer toque, desbloquea el audio (requisito de iOS).
- Escena de juego libre con un **marco de diez** (2×5) que se llena en orden fijo, rango 0–10.
- Botones grandes ➕ (llega una fruta) y ➖ (se va una fruta), con animación.
- Número escrito grande, sincronizado con la cantidad.
- Voz que dice el número en cada cambio y cuenta de 1 a N al tocar una fruta; audios sustituibles por grabaciones propias.
- Límites amables: celebración y ➕ desactivado en 10; ➖ desactivado y mensaje amable en 0.
- Controles de adulto discretos: silenciar la voz y elegir la fruta (una sola fruta por sesión).
- Supresión de gestos accidentales de Safari para iPadOS (zoom por doble toque, menú contextual, rebote).
- Funcionamiento sin conexión una vez instalada.

## Capabilities

### New Capabilities
- `ten-frame-play`: escena de juego libre: marco de diez, añadir y quitar frutas, número escrito, límites 0/10, celebración y selección de fruta.
- `voice-feedback`: desbloqueo de audio, locución de números y conteo, mensajes amables, silencio y audios sustituibles.
- `ipad-pwa-shell`: instalación como PWA, funcionamiento offline y control de gestos táctiles de iPadOS.

### Modified Capabilities
<!-- Ninguna: no hay specs existentes. -->

## Impact

- **Código:** se crea la aplicación completa (no existe código previo).
- **Dependencias:** svelte, vite, typescript, vite-plugin-pwa; vitest y @playwright/test (WebKit) como dependencias de desarrollo.
- **Recursos:** imágenes de frutas y ~15 audios (0–10 y frases), primero sintéticos y luego grabados.
- **Sistemas:** hosting estático con HTTPS en GitHub Pages para el service worker.

## Criterios de Aceptación

- [x] **CA1:** Al tocar ➕ con N < 10 frutas, el marco muestra N+1 frutas, el número muestra N+1 y suena su audio.
- [x] **CA2:** Al tocar ➖ con N > 0 frutas, el marco muestra N−1 frutas, el número muestra N−1 y suena su audio.
- [x] **CA3:** Con 10 frutas, ➕ está desactivado y se muestra una celebración cada vez que se pasa de 9 a 10.
- [x] **CA4:** Con 0 frutas, ➖ está desactivado y, si se toca, suena un mensaje amable sin cambiar la cantidad.
- [x] **CA5:** Las frutas ocupan siempre los huecos en orden: fila superior de izquierda a derecha y después la inferior.
- [x] **CA6:** Al tocar una fruta, se cuenta en voz alta de 1 a N.
- [x] **CA7:** Con la voz silenciada no suena ningún audio y el resto del comportamiento no cambia.
- [x] **CA8:** Cambiar de fruta sustituye todas las frutas visibles por la nueva sin alterar la cantidad.
- [x] **CA9:** Instalada como PWA, la app carga y funciona con el iPad en modo avión.
- [x] **CA10:** En Safari para iPadOS, el doble toque no hace zoom y la pulsación larga no abre el menú contextual.
- [x] **CA11:** La app arranca en una pantalla "¡A jugar!" y, tras tocarla, entra en la escena con 0 frutas y el audio habilitado.
