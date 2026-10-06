## 1. Núcleo

- [x] 1.1 Crear `src/core/worlds.ts`: `WORLDS` (orden y máximos 3/5/7/10), `LEVELS_PER_WORLD`, `Progress`, `nodeState`, `isWorldUnlocked`, `completeLevel` y `isAdventureComplete`
- [x] 1.2 Añadir el parámetro `max` a `nextChallenge` y `howManyOptions` (por defecto 10)
- [x] 1.3 Tests unitarios de mundos (estados de nodo, desbloqueo, `completeLevel` solo avanza en el siguiente) y de retos con `max` (rangos y opciones {1, 2, 3} con máximo 3)

## 2. Estado

- [x] 2.1 `ProgressStore` (`src/state/progress.svelte.ts`): lectura validada de `localStorage` con clave versionada, escritura en cada cambio, `try/catch` y `reset()`
- [x] 2.2 Adaptar `Session` y `ChallengeSession` a una `fruit` explícita, y `ChallengeSession` a un solo reto con `max` y `onSolved` (sin encadenamiento infinito)
- [x] 2.3 `WorldsController`: pantallas (selector, aventura, mapa, reto, celebración de mundo y de aventura), origen, último reto, transiciones con temporizadores y uso de `ProgressStore`
- [x] 2.4 Tests unitarios de `ProgressStore` (corrupto, fuera de rango, escritura que lanza, reinicio) y de `WorldsController` (completar nivel, repetir, completar mundo desde "Mundos" y desde "Aventura", aventura completa, bloqueo)
- [x] 2.5 Adaptar los tests existentes de `ChallengeSession` a `onSolved`, manteniendo acierto, reintento, repetir y escuchar opción

## 3. Audio y recursos

- [x] 3.1 Añadir `worldDone` y `adventureDone` a `manifest.ts` y `generate-tts.sh`, y generar los audios provisionales
- [x] 3.2 Temas por mundo (`src/assets/worlds/themes.ts`) y decoraciones SVG: huerto de manzanas, selva de plátanos, jardín de fresas y naranjal

## 4. UI

- [x] 4.1 Pantalla inicial con 3 botones ("Jugar libre", "Mundos", "Aventura") de ≥160 px que caben en ambas orientaciones, y eliminar "Retos"
- [x] 4.2 `AdultControls` con `showFruitPicker` y botón de reinicio opcional, y diálogo de confirmación del reinicio
- [x] 4.3 `WorldTheme.svelte` (variables CSS y decoración de fondo)
- [x] 4.4 Selector "Mundos": 4 mundos con temática, progreso n/10 y distintivo de completado
- [x] 4.5 Camino de la "Aventura": 4 mundos en camino con estados abierto, siguiente y bloqueado, y animación de desbloqueo
- [x] 4.6 Mapa de niveles: 10 nodos en camino serpenteante sin scroll (5×2 apaisado, 2×5 vertical) con estados completado, siguiente y bloqueado
- [x] 4.7 Escena de reto dentro del tema del mundo (fruta del mundo, sin selector de fruta) y vuelta al mapa tras acertar
- [x] 4.8 Celebraciones de mundo y de aventura (`WorldComplete`), con el tipo anotado en `__celebrationLog`
- [x] 4.9 Enrutado en `App.svelte` con `WorldsController`, y hook e2e `window.__progress.set`
- [x] 4.10 Revisar todas las pantallas nuevas con capturas en vertical y apaisado

## 5. Tests e2e y documentación

- [x] 5.1 Adaptar los e2e de retos e INN-14 a la entrada por un mundo (naranja, 1–10)
- [x] 5.2 e2e de pantalla inicial, selector, mapa, completar nivel y mundo, aventura (bloqueo, paso automático y aventura completa), persistencia con recarga, reinicio (confirmar y cancelar) e inicio y voz
- [x] 5.3 e2e Chromium offline de la aventura con progreso guardado
- [x] 5.4 README: Mundos, Aventura, dificultad por mundo, progreso y reinicio, purga de iPadOS y audios nuevos

## 6. Verificación de Criterios de Aceptación

- [x] 6.1 Verificar **CA1**: la pantalla inicial tiene 3 botones de ≥160 px, el juego libre no cambia y el audio queda habilitado (e2e)
- [x] 6.2 Verificar **CA2**: el selector muestra los 4 mundos en orden con temática y progreso, todos abiertos (e2e)
- [x] 6.3 Verificar **CA3**: los estados de los nodos son correctos y un nodo bloqueado no tiene efecto (e2e + unit)
- [x] 6.4 Verificar **CA4**: los retos usan el rango del mundo y su fruta y temática (e2e + unit)
- [x] 6.5 Verificar **CA5**: acertar completa el nodo y vuelve al mapa; repetir no cambia el progreso (e2e + unit)
- [x] 6.6 Verificar **CA6**: completar un mundo lo celebra con su audio y vuelve al selector (e2e + unit)
- [x] 6.7 Verificar **CA7**: la aventura tiene bloqueo y abre sola el siguiente mundo (e2e + unit)
- [x] 6.8 Verificar **CA8**: la aventura completa lo celebra con su audio y deja los 4 mundos completados (e2e + unit)
- [x] 6.9 Verificar **CA9**: el progreso sobrevive a una recarga y el almacenamiento corrupto o bloqueado no da errores (e2e + unit)
- [x] 6.10 Verificar **CA10**: el reinicio funciona al confirmar y no cambia nada al cancelar (e2e + unit)
- [x] 6.11 Verificar **CA11**: "inicio" funciona desde todas las pantallas nuevas y la voz silenciada se respeta (e2e)
- [ ] 6.12 Verificar **CA12**: los mundos funcionan sin conexión (e2e Chromium + prueba manual en iPad en modo avión)
- [ ] 6.13 Cumplir la **Definition of Done** de design.md
