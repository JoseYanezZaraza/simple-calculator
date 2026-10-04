## 1. Núcleo de retos

- [x] 1.1 Implementar `src/core/challenges.ts`: tipos `Challenge`, `nextChallenge(previous, random)` sin repetir el anterior, distractores en ±3 y `isCorrect`
- [x] 1.2 Añadir un PRNG con semilla (mulberry32) en `src/core/random.ts`
- [x] 1.3 Tests unitarios: rango 1..10, 3 opciones distintas con N incluida, distractores a distancia ≤3, no repetición en 1000 iteraciones con semilla e `isCorrect`

## 2. Narración y estado

- [x] 2.1 Extraer el conteo cancelable de `Session` a `src/state/narrator.ts` (pasos de clip y resaltado, mismos tiempos con voz silenciada)
- [x] 2.2 Adaptar `Session` para usar `Narrator` y aceptar la opción `celebrateFull` (por defecto `true`), con todos sus tests en verde sin cambios
- [x] 2.3 Crear el store `preferences` (fruta y voz) compartido entre modos
- [x] 2.4 Implementar `ChallengeSession`: reto actual, marco (`Session` con `celebrateFull: false`), fases `asking`/`celebrating`, acierto con pausa `SUCCESS_PAUSE_MS`, reintento "contar juntos", repetir la pregunta y `next()`
- [x] 2.5 Tests unitarios de `Narrator` y `ChallengeSession` (acierto, fallo en ambos tipos, ✓ con marco vacío, toques durante la celebración, silencio y 10 sin celebración)

## 3. Audio

- [x] 3.1 Añadir `howMany`, `put`, `wellDone` y `letsCount` al `manifest.ts` y a `scripts/generate-tts.sh`, y generar los audios provisionales
- [x] 3.2 Comprobar que el precache del service worker incluye los audios nuevos

## 4. UI

- [x] 4.1 Pantalla inicial con selector: botones "jugar libre" y "retos" (≥160 px) con dibujo y etiqueta, que desbloquean el audio
- [x] 4.2 Modo de la app en `App.svelte` (`home`/`free`/`challenges`) y control de adulto "inicio" en `AdultControls`
- [x] 4.3 Escena "¿Cuántas hay?": marco fijo con N frutas, 3 opciones grandes neutras y botón de repetir
- [x] 4.4 Escena "Pon N": marco, N escrito en grande, botón de repetir y botones ➖ ✓ ➕
- [x] 4.5 Celebración de acierto y transición al siguiente reto, con las respuestas bloqueadas durante la fase `celebrating`
- [x] 4.6 Layout vertical y apaisado de la escena de retos
- [x] 4.7 En modo `e2e`, exponer `window.__challenges.set()` y `data-kind`/`data-target` en la escena

## 5. Tests e2e y regresión

- [x] 5.1 Actualizar `startGame` de los e2e del incremento 1 para entrar por "jugar libre", con toda la suite anterior en verde
- [x] 5.2 e2e WebKit iPad (vertical y apaisado) de los retos, uno por CA
- [x] 5.3 e2e Chromium offline del modo retos

## 6. Documentación

- [x] 6.1 README: modo retos, tabla de audios nuevos y constante `SUCCESS_PAUSE_MS`

## 7. Verificación de Criterios de Aceptación

- [x] 7.1 Verificar **CA1**: la pantalla inicial tiene "jugar libre" y "retos", cada uno entra en su modo y el audio queda habilitado (e2e)
- [x] 7.2 Verificar **CA2**: "¿Cuántas hay?" muestra N frutas, suena la pregunta y hay 3 opciones distintas con N (e2e + unit)
- [x] 7.3 Verificar **CA3**: el acierto muestra celebración, suena "¡Muy bien!" y aparece un reto nuevo (e2e + unit)
- [x] 7.4 Verificar **CA4**: una opción incorrecta lleva a contar juntos y repetir la pregunta, en el mismo reto y sin indicadores de error (e2e + unit)
- [x] 7.5 Verificar **CA5**: "Pon N" empieza vacío, muestra N, dice "Pon N", ➕/➖ funcionan y en 10 no hay celebración (e2e + unit)
- [x] 7.6 Verificar **CA6**: ✓ con N es acierto y con otra cantidad lleva a contar y repetir sin vaciar el marco (e2e + unit)
- [x] 7.7 Verificar **CA7**: no hay dos retos consecutivos iguales (unit con semilla)
- [x] 7.8 Verificar **CA8**: el botón de repetir reproduce la pregunta actual (e2e)
- [x] 7.9 Verificar **CA9**: "inicio" vuelve a la pantalla inicial desde ambos modos, conservando la fruta (e2e)
- [x] 7.10 Verificar **CA10**: con la voz silenciada los retos funcionan sin audio, y se usa la fruta elegida (e2e + unit)
- [x] 7.11 Verificar **CA11**: los retos funcionan sin conexión (e2e Chromium + prueba manual en iPad en modo avión OK, verificada por el usuario el 2026-10-04)
- [x] 7.12 Cumplir la **Definition of Done** de design.md
