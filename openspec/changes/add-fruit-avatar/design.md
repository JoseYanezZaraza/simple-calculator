## Context

Este cambio se apoya en `add-world-map` (INN-15), todavía sin archivar:
- `WorldsController` decide la pantalla: `worlds`, `adventure` (con `unlocking`), `levels`, `challenge`, `worldComplete` y `adventureComplete`.
- `LevelMap` coloca 10 nodos con posiciones en % distintas para vertical y apaisado.
- `AdventurePath` coloca 4 nodos de la misma forma.
- `ProgressStore` guarda el progreso con la clave `contar-frutas:progress:v1`.
- La pausa de desbloqueo en la aventura es `UNLOCK_PAUSE_MS` = 2,5 s.
- Las animaciones continuas sobre elementos tocables los vuelven "inestables" para Playwright y más difíciles de acertar, así que se animan halos o elementos no interactivos.

## Goals / Non-Goals

**Goals:**
- Avatar elegido una vez, persistente y cambiable (CA1–CA3).
- Posición coherente con el progreso y un salto visible solo cuando se avanza (CA4–CA6).
- No interferir con los toques ni con los tests, y respetar "reducir movimiento" (CA4, CA8).

**Non-Goals:**
- Personalizar el avatar o desbloquear personajes.
- Mostrar el avatar en el juego libre o dentro de los retos.
- Sonido de salto: no hay un TTS adecuado. Se puede añadir como audio sustituible más adelante.

## Decisions

### D1. Personajes en SVG propios (`src/assets/avatars/`)
4 SVG (`apple.svg`, `banana.svg`, `strawberry.svg` y `orange.svg`) derivados de los dibujos de fruta existentes, con ojos (círculo blanco y pupila), mejillas, sonrisa y dos patitas. La animación de reposo es CSS, un balanceo de ±4° en `rotate` dentro del propio avatar, que no es tocable.
- *Alternativa descartada:* Lottie o sprites. Añaden dependencia y peso para un efecto simple.

### D2. `AvatarStore` (`src/state/avatar.svelte.ts`)
`avatar = $state<Fruit | null>()`, que se lee de `localStorage['contar-frutas:avatar:v1']`. Solo se aceptan los 4 ids conocidos y cualquier otro valor se trata como `null`. La escritura va en `try/catch`. La clave es separada de la del progreso para que `ProgressStore.reset()` no lo toque (CA7) y para no alterar el formato v1 del progreso.

### D3. Pantalla de elección en el flujo del controlador
`WorldsScreen` gana `{ name: 'avatarPicker'; then: 'worlds' | 'adventure' }`.
- **Primera entrada:** si `avatarStore.avatar === null`, el constructor de `WorldsController` arranca en el picker y reproduce `chooseAvatar` cuando el audio está listo.
- **Cambio de avatar:** `openAvatarPicker()` desde el selector o la aventura.
- **Elección:** `chooseAvatar(fruit)` guarda y va a `then`.

### D4. Posición anterior para el salto
`WorldsController` guarda `avatarFrom: { world, level } | null`:
- **Nivel:** en `levelSolved`, si el progreso avanzó, `avatarFrom = { world, level }` (el nodo completado).
- **Mundo:** en `afterWorld` de la aventura, `adventureFrom = world` mientras dura `unlocking`.

`LevelMap` y `AdventurePath` reciben `from?` y animan desde ahí hasta la posición actual. Tras la animación (o con un temporizador de 1,2 s), el controlador limpia `avatarFrom`, así que volver a abrir el mapa no repite el salto. Repetir un nivel completado no fija `avatarFrom` (CA5).

### D5. Salto con Web Animations API
`Avatar.svelte` se posiciona con `left` y `top` en %, con las mismas fórmulas del mapa. Cuando recibe `from`, ejecuta `element.animate()` con keyframes:
- **`left` y `top`:** van de origen a destino;
- **`translate`:** una parábola (0 → −40 % de la altura del contenedor → 0);
- **`scale`:** un "squash" de 1 → 1,1 → 0,9 → 1 al aterrizar.

Dura 900 ms. Con `matchMedia('(prefers-reduced-motion: reduce)')` no se anima: se coloca directamente en el destino (CA8). En e2e cada salto se anota en `__hopLog` (`{ from, to, animated }`), así que los tests no dependen de capturar el movimiento.
- *Alternativa descartada:* transiciones CSS en `left`/`top`. No permiten un arco sin elementos anidados y se reinician mal al cambiar de orientación.

### D6. El avatar no intercepta toques
`pointer-events: none` en el contenedor del avatar, con `z-index` por encima del nodo. El tamaño es aproximadamente el 80 % del nodo y va desplazado hacia arriba, como si estuviera "de pie" sobre él, para que el número siga visible en parte.

### D7. Botón de cambio de avatar
En el selector y en la aventura, abajo a la izquierda: un botón redondo de 96 px con el avatar actual (`data-testid="avatar-button"`). Va separado de los controles de adulto porque es para la niña. Elegir a su personaje es parte del juego.

### D8. Tests
- **Vitest:**
  - `AvatarStore`: valor inválido, almacenamiento que lanza y persistencia.
  - `WorldsController`: picker la primera vez y solo entonces; `then` correcto; `avatarFrom` fijado solo al avanzar; `adventureFrom` durante `unlocking`; el reinicio no toca el avatar.
- **Playwright:**
  - hook `window.__avatar.set()` para sembrar el avatar;
  - `__hopLog` para comprobar los saltos;
  - `data-at` del avatar para su posición;
  - un proyecto con `reducedMotion: 'reduce'` para CA8 (o `page.emulateMedia` en el test);
  - offline en Chromium.
- **Adaptación de los e2e existentes de mundos:** siembran un avatar en `openHome`, para no topar con el picker.

## Risks / Trade-offs

- [La pantalla de elección retrasa la primera partida] → Aparece solo una vez y basta un toque. La voz explica qué hacer.
- [El avatar tapa el número del nodo siguiente] → Va desplazado hacia arriba y tiene `pointer-events: none`. El nodo siguiente ya se distingue por color y halo.
- [El salto y la apertura automática de la aventura se solapan] → El salto (900 ms) empieza al mostrarse el camino y termina antes de que acabe `UNLOCK_PAUSE_MS` (2,5 s).
- [Cambio de orientación a mitad de salto] → La animación termina en la posición final calculada para la orientación actual. Un salto incompleto no deja estado inconsistente.

## Open Questions

- ¿Debe sonar el nombre del personaje al elegirlo ("¡La fresa!")? Ahora no; se puede añadir como audio sustituible.

## Definition of Done (técnica)

- [ ] Tests automatizados cubren cada Criterio de Aceptación del proposal (CA9 con verificación manual complementaria en iPad)
- [ ] Los tests existentes siguen pasando
- [ ] Lint / formato / typecheck en verde (`svelte-check`, ESLint, Prettier)
- [ ] `openspec validate --strict` sin errores
- [ ] Documentación actualizada: README (avatar, cambio y audio nuevo)
- [ ] PR en GitHub enlazado al issue de Linear INN-16
- [ ] Probado en un iPad real como PWA instalada
