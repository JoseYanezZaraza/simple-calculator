## Context

El incremento 1 (archivado como `2026-10-02-add-free-play-ten-frame`) dejó una arquitectura en tres capas:
- **Núcleo puro** `src/core/tenFrame.ts`.
- **Sesión** `src/state/session.svelte.ts`, que traduce eventos en audio y gestiona el conteo cancelable con resaltado.
- **`AudioService`** de voz única.

La UI es Svelte 5, con una pantalla inicial de un solo botón y una escena de juego libre. Los tests son Vitest y Playwright WebKit iPad, más Chromium para offline. La app se despliega en GitHub Pages.

Este cambio añade un segundo modo (retos) que reutiliza el marco de diez, el conteo, la celebración y los controles de adulto, y convierte la pantalla inicial en un selector de modo.

## Goals / Non-Goals

**Goals:**
- Retos "¿Cuántas hay?" y "Pon N frutas" con N de 1 a 10, alternados al azar y sin repetir el anterior (CA2–CA7).
- Reintento sin penalización: contar juntos y repetir la pregunta (CA4, CA6).
- Selector de modo en la pantalla inicial y vuelta al inicio (CA1, CA9).
- Reutilizar el núcleo, el conteo y la celebración sin duplicar lógica.
- Retos deterministas en los tests.

**Non-Goals:**
- Dificultad adaptativa, niveles, rangos configurables.
- Puntuación, rachas o persistencia.
- Ecuación simbólica.
- Cambios en el comportamiento del juego libre, salvo la entrada desde el selector.

## Decisions

### D1. Núcleo de retos puro (`src/core/challenges.ts`)
```ts
type Challenge =
  | { kind: 'howMany'; target: number; options: [number, number, number] }
  | { kind: 'put'; target: number }
nextChallenge(previous: Challenge | null, random: () => number): Challenge
isCorrect(challenge, answer: number): boolean   // opción tocada o cantidad al pulsar ✓
```
- **Tipo:** 50 % cada uno. **N:** uniforme en 1..10. Si sale igual al anterior (mismo tipo y N), se vuelve a sortear.
- **Distractores:** 2 valores distintos sorteados entre los candidatos `{N−3..N+3} ∩ [1,10] \ {N}` (siempre hay ≥3 candidatos), con las 3 opciones barajadas.
- `random` se inyecta: `Math.random` en producción y un PRNG con semilla (mulberry32) en los tests.
- *Alternativa descartada:* distractores totalmente aleatorios en 1..10. Opciones como 2/9 frente a N=3 se resuelven sin contar y el reto pierde valor.

### D2. Narración reutilizable (`src/state/narrator.ts`)
Se extrae de `Session` el conteo cancelable a un `Narrator`, que reproduce una secuencia de **pasos**. Cada paso es un clip (opcional) más el índice de la fruta a resaltar (opcional), y cada paso espera `max(750 ms, duración del clip + 150 ms)`. Con la voz silenciada, los tiempos son los mismos (CA10).
- `Session.countAloud()` pasa a ser `narrator.run(countSteps(n))`, sin cambio de comportamiento.
- El reintento es `narrator.run([letsCount, ...countSteps(n), ...questionSteps])`.
- Cualquier toque nuevo cancela la narración en curso (mismo criterio que en el incremento 1).
- *Alternativa descartada:* añadir un `onended` al `AudioService` y encadenar por eventos de audio. Rompe el comportamiento con la voz silenciada, donde no hay audio que termine.

### D3. Estado del modo retos (`src/state/challengeSession.svelte.ts`)
`ChallengeSession` contiene:
- el reto actual;
- una `Session` propia para el marco, creada con la opción `celebrateFull: false` (en "Pon N", llegar a 10 no celebra ni dice la frase de lleno, CA5);
- el `Narrator`;
- un estado `phase: 'asking' | 'celebrating'`.

Funcionamiento:
- **Acierto:** `celebration++` y `wellDone`. Durante 2 s, en fase `celebrating`, se ignoran las respuestas y después llega `next()`.
- **Fallo:** narración de reintento. En "¿Cuántas hay?" el marco se fija con N frutas y no hay ➕/➖.
- **Fruta y voz:** se comparten entre modos con un pequeño store `preferences` (fruta y voz), que se conserva al volver al inicio (CA9).

### D4. Modo de la app
`App.svelte` guarda `mode: 'home' | 'free' | 'challenges'`.
- **Desde "home":** cualquiera de los dos botones llama a `audio.unlock()` dentro del gesto y crea una sesión nueva del modo elegido (marco vacío o reto nuevo).
- **"Inicio" (control de adulto, icono de casa):** hace `audio.stop()`, cancela la narración y vuelve a `home`.

### D5. Audios nuevos
| Archivo | Texto TTS provisional |
|---|---|
| `howMany.m4a` | "¿Cuántas frutas hay?" |
| `put.m4a` | "Pon" (se encadena con el número: `playSequence(['put', '4'])`) |
| `wellDone.m4a` | "¡Muy bien!" |
| `letsCount.m4a` | "¡Vamos a contarlas!" |

Se añaden al `manifest.ts` y a `scripts/generate-tts.sh`, y el precache los incluye automáticamente por el glob `*.m4a`.
- *Alternativa descartada:* grabar "pon uno" … "pon diez" (10 audios más). Se acepta la concatenación. Si suena entrecortada con las grabaciones reales, se reconsidera en un incremento futuro.

### D6. UI de retos
- **Pantalla inicial:** dos botones circulares de unos 200 px.
  - "Jugar libre": mini marco de diez con frutas.
  - "Retos": bocadillo con "?" y una fruta.
  - Cada uno con su etiqueta de texto debajo, para el adulto.
- **Escena "¿Cuántas hay?":** marco arriba y 3 botones de número de unos 140 px (colores neutros iguales para los tres, para no dar pistas). Al lado, el botón de repetir (altavoz grande).
- **Escena "Pon N":** marco arriba, N escrito en grande (el mismo componente `NumberDisplay`) junto al botón de repetir y, abajo, ➖ ✓ ➕ (✓ azul, mismo tamaño que ➕/➖).
- **Reutilizados:** `TenFrame`, `NumberDisplay`, `Celebration` y `AdultControls` (con el nuevo `onhome`).
- **Orientación:** vertical y apaisada, con la misma rejilla que la escena libre.

### D7. Tests
- **Vitest:**
  - `challenges.ts`: rango, distractores ±3, opciones distintas, no repetición y `isCorrect`. Con semilla y 1000 iteraciones.
  - `Narrator`: orden, tiempos, cancelación y silencio.
  - `ChallengeSession`: acierto, fallo, fase de celebración y `celebrateFull: false`.
- **Playwright:** en modo `e2e`, `window.__challenges.set(challenge)` fuerza el reto actual para escenarios deterministas (N=6 con opciones 4/6/8). La escena expone `data-kind` y `data-target` para leer el reto.
- **Regresión:** el helper `startGame` de los e2e del incremento 1 pasa a tocar "jugar libre". CA9 offline de retos se añade al proyecto Chromium.

## Risks / Trade-offs

- [Una niña de 3 años no lee las opciones "4/6/8"] → Lo mitiga el reintento con conteo, que asocia número y cantidad. Si en la prueba real se ve que adivina al azar sin aprender, se valorará decir el número al tocar la opción antes del feedback (pregunta abierta).
- [La concatenación "Pon" + número suena entrecortada] → Clips cortos sin silencios, y opción de grabar frases completas más adelante (D5).
- [La pausa de 2 s tras acertar puede parecer lenta o rápida] → Constante única `SUCCESS_PAUSE_MS`, ajustable tras probarlo con la niña.
- [La refactorización del conteo (D2) puede romper el juego libre] → Los tests unitarios y e2e existentes de CA6 y CA7 del incremento 1 deben seguir pasando sin cambios.
- [Los toques muy rápidos durante la transición entre retos] → La fase `celebrating` ignora las respuestas, y cada cambio de reto cancela la narración.

## Open Questions

- ¿Debe sonar el número al tocar una opción en "¿Cuántas hay?" (p. ej. "ocho") antes del "¡Vamos a contarlas!"? Ahora no se dice: se valida tras probarlo con la niña.

## Definition of Done (técnica)

- [ ] Tests automatizados cubren cada Criterio de Aceptación del proposal (CA11 con verificación manual complementaria en iPad real)
- [ ] Los tests del incremento 1 siguen pasando (solo cambia la entrada por "jugar libre")
- [ ] Lint / formato / typecheck en verde (`svelte-check`, ESLint, Prettier)
- [ ] `openspec validate --strict` sin errores
- [ ] Documentación actualizada: README (modo retos, audios nuevos)
- [ ] PR en GitHub enlazado al issue de Linear INN-13
- [ ] Probado en un iPad real como PWA instalada (retos online y en modo avión)
