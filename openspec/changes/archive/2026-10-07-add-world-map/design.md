## Context

Estado tras INN-12, INN-13 e INN-14:
- **Pantalla inicial:** "Jugar libre" y "Retos" (`StartScreen`), con `App.svelte` en modos `home | free | challenges`.
- **`ChallengeSession`:** encadena retos infinitos con `nextChallenge(previous, random)` en 1–10, con las fases `asking` y `celebrating` y `SUCCESS_PAUSE_MS` de 2 s.
- **`Narrator`:** pasos cancelables con resaltado de frutas y opciones.
- **`Preferences`:** fruta y voz, compartidas entre modos y no persistentes.
- **Componentes compartidos:** `SceneLayout`, `ActionButton`, `SpeakerButton`, `Celebration` y `AdultControls` (con inicio, voz y fruta).
- **Tests:** e2e WebKit iPad, que usan registros de prueba (`__audioLog`, `__celebrationLog`, `__highlightLog`, `__optionHighlightLog`) y `__challenges.set` en el build `e2e`.
- **Sin persistencia:** hasta ahora no se guardaba nada entre sesiones.

Restricciones:
- **Sin scroll:** los gestos de desplazamiento están bloqueados, así que el mapa de 10 nodos y los caminos deben caber en la pantalla del iPad en ambas orientaciones.
- **iPadOS puede purgar el almacenamiento** de una PWA sin uso prolongado.

## Goals / Non-Goals

**Goals:**
- 4 mundos con dificultad creciente y 10 niveles cada uno: "Mundos" (libre) y "Aventura" (lineal con bloqueo) (CA1–CA8).
- Progreso persistente, robusto ante fallos de almacenamiento y reiniciable por el adulto (CA9, CA10).
- Temática por mundo sin perder la legibilidad ni los tamaños táctiles.
- Reutilizar el núcleo de retos, `ChallengeSession`, `Narrator` y los componentes de escena.

**Non-Goals:**
- Más mundos, editor de niveles o retos predefinidos por nivel: cada nivel genera su reto al azar dentro del rango.
- Estrellas o puntuación por rendimiento.
- Sincronizar entre dispositivos o exportar el progreso.
- Persistir la voz o la fruta del juego libre: siguen siendo de sesión.

## Decisions

### D1. Núcleo de mundos (`src/core/worlds.ts`, puro)
```ts
type WorldId = 'apple' | 'banana' | 'strawberry' | 'orange'
const WORLDS = [{ id: 'apple', max: 3 }, { id: 'banana', max: 5 },
                { id: 'strawberry', max: 7 }, { id: 'orange', max: 10 }] as const
const LEVELS_PER_WORLD = 10
type Progress = Record<WorldId, number>   // niveles completados 0..10
nodeState(progress, world, level): 'done' | 'next' | 'locked'
isWorldUnlocked(progress, world): boolean  // primero o anteriores completos
completeLevel(progress, world, level): Progress  // solo avanza si level === siguiente
isAdventureComplete(progress): boolean
```
El `WorldId` coincide con el `Fruit` existente, así que la fruta del mundo es su id.
- *Alternativa descartada:* guardar un conjunto de niveles completados por mundo. Como se juegan en orden, un contador basta y evita estados imposibles, como el 5 completado sin el 4.

### D2. Rango en el núcleo de retos
`nextChallenge(previous, random, max = 10)` y `howManyOptions(target, random, max = 10)` reciben el máximo del mundo. Los candidatos a distractor son `{N−3..N+3} ∩ [1, max] \ {N}`. Con `max = 3` siempre quedan exactamente 2 candidatos, así que las opciones son {1, 2, 3}. Con `max ≥ 3` hay al menos 2 candidatos para cualquier N. Los valores por defecto mantienen los tests existentes.

### D3. `ChallengeSession` de un solo reto
Pasa a recibir `{ max, fruit, onSolved }`. Al acertar, celebra, dice "¡Muy bien!" y, tras `SUCCESS_PAUSE_MS`, llama a `onSolved()` en lugar de `next()`. Se elimina el encadenamiento infinito. "Repetir", "contar juntos" y "escuchar opción" no cambian. El último reto jugado se guarda en el controlador de mundos para cumplir "no igual al anterior" entre niveles.
- *Alternativa descartada:* un `LevelSession` nuevo. Duplicaría la lógica de acierto y reintento ya probada.

### D4. Fruta de la escena desacoplada de `Preferences`
`Session` y `ChallengeSession` aceptan `fruit` explícita. En el juego libre sigue siendo `preferences.fruit`; en un mundo, la del mundo. `AdultControls` recibe `showFruitPicker` (por defecto `true`), que es `false` en las pantallas de mundos.

### D5. Persistencia (`src/state/progress.svelte.ts`)
`ProgressStore` con `$state<Progress>`:
- **Lectura:** al construirse, de `localStorage['contar-frutas:progress:v1']`, en JSON `{ "version": 1, "worlds": { "apple": 0, … } }`. Se valida cada valor: entero en 0..10 y claves conocidas. Si algo falla, se usa el progreso vacío.
- **Escritura:** en cada cambio. Las lecturas y escrituras van en `try/catch`, así que el modo privado, una cuota llena o un almacenamiento bloqueado no rompen nada (CA9).
- **Reinicio:** `reset()` escribe el progreso vacío (CA10).
- **Fuente:** la misma para "Mundos" y "Aventura".

La clave versionada permite migrar en el futuro.
- *Alternativas descartadas:*
  - IndexedDB: es asíncrona y excesiva para 4 enteros.
  - Cookies: se envían al servidor y no aportan nada aquí.

### D6. Navegación (`App.svelte`)
```
home ──Jugar libre──▶ free
  ├──Mundos──▶ worlds(selector) ──mundo──▶ levels(world, origin='worlds') ──nodo──▶ challenge
  └─Aventura─▶ adventure(camino)  ──mundo──▶ levels(world, origin='adventure') ──nodo──▶ challenge
challenge ──acierto──▶ levels  (si era el 10 y se completa el mundo ──▶ WorldComplete)
WorldComplete ──origin=worlds──▶ worlds
              ──origin=adventure──▶ adventure (desbloqueo) ──2,5 s──▶ levels(siguiente)
                                     └─si era naranja ──▶ AdventureComplete ──▶ adventure
"inicio" (cualquiera) ──▶ home
```
Un `WorldsController` (`src/state/worldsController.svelte.ts`) contiene la pantalla actual, el origen, el mundo, el último reto, el `ProgressStore` y los temporizadores de transición. Así la lógica se puede probar sin UI. `App.svelte` solo enruta.

### D7. Temática por mundo
`src/assets/worlds/themes.ts` define, por mundo, las variables CSS `--world-bg`, `--world-accent`, `--world-accent-dark` y `--world-path`, y una decoración SVG propia:

| Mundo | Ambiente | Paleta |
|---|---|---|
| Manzana | huerto con árboles de manzanas | rojo y verde |
| Plátano | selva con palmeras | amarillo y verde |
| Fresa | jardín con flores | rosa |
| Naranja | naranjal al atardecer | naranja y azul |

Las variables se aplican en un contenedor `WorldTheme.svelte` que envuelve el mapa y los retos. Las decoraciones van como fondo con `pointer-events: none` y con contraste bajo, para no competir con el marco ni con los números. Se precachean con el glob `*.svg`.

### D8. Mapa de niveles sin scroll
Los 10 nodos van en un camino serpenteante de 2 filas de 5 en apaisado y de 5 filas de 2 en vertical. Las posiciones se calculan en porcentajes sobre un contenedor de proporción fija, y un `path` SVG une los centros. Los nodos miden ≥96 px y muestran su número:
- **completados:** fruta con ✓;
- **siguiente:** número grande con pulso, del color de acento;
- **bloqueados:** gris con candado, `aria-disabled`.

El camino de la aventura y el selector usan la misma idea con 4 nodos grandes (≥160 px).

### D9. Celebraciones y audios
- **Al completar un mundo:** `WorldComplete.svelte`, una pantalla breve (unos 3 s) con la fruta del mundo grande, lluvia de frutas y el audio `worldDone`.
- **Al completar la aventura:** `adventureDone` y la celebración con las 4 frutas.
- **Audios nuevos:** `worldDone` ("¡Completaste el mundo!") y `adventureDone` ("¡Completaste la aventura!"), que se añaden a `manifest.ts` y a `generate-tts.sh`. El total pasa a 19 clips.
- **Registro de e2e:** las celebraciones se anotan en `__celebrationLog` con su tipo: `level`, `world` o `adventure`.

### D10. Reinicio con confirmación
Un botón discreto (icono ↺) con los controles de adulto, solo en el selector y la aventura. Abre un diálogo modal con texto ("¿Borrar todo el progreso de los mundos?") y dos botones: "Borrar" y "Cancelar". Así se evita que la niña lo active sin querer. El diálogo no usa `window.confirm` porque el estilo nativo no encaja y en una PWA a pantalla completa puede comportarse de forma inconsistente.

### D11. Tests
- **Vitest:**
  - `worlds.ts`: estados de nodo, desbloqueo y `completeLevel` idempotente.
  - `challenges.ts` con `max`: rangos y opciones {1, 2, 3}.
  - `ProgressStore` con un almacenamiento falso: JSON corrupto, valores fuera de rango, escritura que lanza y reinicio.
  - `WorldsController`: flujos de "Mundos" y "Aventura" con temporizadores falsos.
- **Playwright:**
  - un hook `window.__progress.set(progress)` (solo e2e) para sembrar estados;
  - `__challenges.set` sigue sirviendo para forzar el reto del nivel;
  - los e2e de retos existentes entran por un mundo (mundo naranja, rango 1–10, para no tocar sus datos);
  - la persistencia se comprueba recargando la página;
  - la aventura offline se prueba en el proyecto Chromium.

## Risks / Trade-offs

- [iPadOS purga el `localStorage` de una PWA sin uso durante semanas y se pierde el progreso] → Se acepta y se documenta en el README. La app sigue funcionando desde cero.
- [Las decoraciones temáticas distraen del conteo] → Opacidad baja y decoración solo en los bordes, con el marco sobre fondo liso. Se valida con capturas y con la niña.
- [10 nodos más controles en vertical sin scroll] → Rejilla de 5×2 con nodos de ≥96 px. Se comprueba con medidas en los e2e en ambas orientaciones.
- [La niña pierde la orientación entre mapa y retos] → Transiciones cortas, el nodo siguiente siempre iluminado y vuelta al mapa tras cada acierto.
- [Eliminar los retos infinitos rompe hábitos ya adquiridos] → Es decisión de producto (BREAKING en el proposal). El mundo naranja ofrece el mismo rango 1–10.
- [Cambiar `ChallengeSession` rompe los tests de INN-13 e INN-14] → Se adaptan a `onSolved`. Los comportamientos de acierto, reintento, repetir y escuchar opción deben seguir pasando.

## Open Questions

- ¿Debe sonar el nombre del mundo al abrirlo (por ejemplo, "¡Mundo manzana!")? Ahora no; se puede añadir como audio sustituible más adelante.

## Definition of Done (técnica)

- [x] Tests automatizados cubren cada Criterio de Aceptación del proposal (CA12 con verificación manual complementaria en iPad)
- [x] Los tests existentes siguen pasando, adaptados a la entrada por mundos
- [x] Lint / formato / typecheck en verde (`svelte-check`, ESLint, Prettier)
- [x] `openspec validate --strict` sin errores
- [x] Documentación actualizada: README (Mundos, Aventura, progreso y reinicio, audios nuevos)
- [x] PR en GitHub enlazado al issue de Linear INN-15
- [x] Probado en un iPad real como PWA instalada (online, en modo avión y tras cerrar y reabrir) — verificado por el usuario el 2026-10-07
