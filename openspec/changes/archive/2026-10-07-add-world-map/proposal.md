> **Linear:** [INN-15](https://linear.app/inno8/issue/INN-15/incremento-3-mapa-de-mundos-por-fruta-con-10-retos-cada-uno-mundos-y) · Proyecto [P-INN-2](https://linear.app/inno8/project/calculadora-interactiva-infantil-952da72f318f) · **Estado:** Implementado (PR #6)

## Why

Los retos actuales son infinitos y al azar: la niña no ve que avanza ni tiene una meta, y la dificultad (1–10) es la misma desde el primer toque. Organizarlos en **mundos temáticos por fruta, con 10 niveles cada uno y dificultad creciente**, da una sensación clara de progreso ("¡ya completé el mundo manzana!"). Además empieza por cantidades pequeñas (1–3), más adecuadas para una niña de 3 años. La **aventura lineal** guía al adulto y a la niña de un mundo al siguiente sin tener que decidir nada.

## What Changes

- **BREAKING** **Menú principal:** "Jugar libre", **"Mundos"** y **"Aventura"**. El botón "Retos" y los retos infinitos al azar desaparecen.
- **4 mundos en orden fijo, con rango creciente:**
  - 🍎 Manzana: 1–3
  - 🍌 Plátano: 1–5
  - 🍓 Fresa: 1–7
  - 🍊 Naranja: 1–10
- **Temática por mundo:** colores, fondo decorado con su fruta y frutas del marco de diez de ese mundo. El selector de fruta del adulto no aparece en los mundos.
- **Mapa de niveles por mundo:** un camino de 10 nodos.
  - Cada nodo es un reto ("¿Cuántas hay?" o "Pon N frutas") dentro del rango del mundo.
  - Los niveles se juegan en orden. Al acertar, se vuelve al mapa, el nodo queda completado y el siguiente se ilumina.
  - Los niveles completados se pueden repetir.
- **"Mundos":** un selector con los 4 mundos y su progreso. Todos están abiertos.
- **"Aventura":** un camino con los 4 mundos.
  - Solo está abierto el primer mundo sin completar.
  - Al completar un mundo, el siguiente se desbloquea y se abre solo.
  - Al completar el último, hay una celebración de aventura completada.
- **Celebración especial al completar un mundo**, con 2 audios nuevos: "¡Completaste el mundo!" y "¡Completaste la aventura!".
- **El progreso se guarda en el iPad** (funciona sin conexión), con un control de adulto para **reiniciarlo con confirmación**.

## Capabilities

### New Capabilities
- `world-map`: mundos, temática, selector "Mundos", mapa de niveles, finalización de nivel y de mundo, "Aventura", progreso persistente y su reinicio.

### Modified Capabilities
- `count-challenges`: cambian cinco requisitos y se elimina uno.
  - **"Encadenamiento de retos":** los retos ya no son infinitos; cada nivel es un reto dentro del rango de su mundo.
  - **"Reto ¿Cuántas hay?":** las opciones quedan limitadas al rango del mundo.
  - **"Acierto":** se vuelve al mapa en lugar de pasar a otro reto.
  - **"Volver al inicio":** cubre también el mapa y el selector.
  - **"Retos con voz silenciada y fruta elegida":** la fruta es la del mundo, no la del adulto.
  - **"Retos sin conexión":** se elimina; queda cubierto por "Mundos sin conexión" de `world-map`.
- `ten-frame-play`: la "Pantalla inicial de juego" pasa a tener tres botones.
- `voice-feedback`: el "Desbloqueo de audio con el primer toque" funciona con cualquiera de los tres botones.

## Impact

- **Código:**
  - Nuevo núcleo `src/core/worlds.ts`: mundos, rangos y reglas de bloqueo.
  - Nuevo `src/state/progress.svelte.ts`: progreso con `localStorage`.
  - `challenges.ts` acepta un rango máximo.
  - `ChallengeSession` pasa a ser de un solo reto, con un callback de acierto.
  - Pantallas nuevas: selector de mundos, camino de la aventura y mapa de niveles.
  - Temas por mundo con variables CSS y decoración SVG.
  - Se elimina el modo de retos infinitos.
- **Recursos:**
  - 2 audios TTS nuevos (`worldDone`, `adventureDone`).
  - Decoraciones SVG por mundo.
- **Tests:**
  - Unitarios de mundos, progreso y bloqueo.
  - Los e2e de retos se adaptan a la entrada por un mundo.
  - e2e de mapa, aventura, persistencia y reinicio.
- **Sin dependencias nuevas.**

## Criterios de Aceptación

- [x] **CA1:** La pantalla inicial muestra tres botones grandes, "Jugar libre", "Mundos" y "Aventura". "Jugar libre" mantiene el comportamiento actual y cualquiera de los tres deja el audio habilitado.
- [x] **CA2:** "Mundos" muestra los 4 mundos en orden (manzana, plátano, fresa, naranja), cada uno con su temática y su progreso (niveles completados de 10). Todos se pueden abrir.
- [x] **CA3:** El mapa de niveles de un mundo muestra 10 nodos en camino:
  - los completados, marcados;
  - el siguiente, iluminado;
  - los posteriores, bloqueados.

  Solo se pueden jugar el siguiente y los completados. Tocar un nodo bloqueado no hace nada ni muestra errores.
- [x] **CA4:** Los retos de un mundo usan su rango: N y las opciones están entre 1 y el máximo del mundo (3, 5, 7 o 10). Las frutas del marco son las del mundo y la escena muestra su temática.
- [x] **CA5:** Al acertar un nivel se celebra y se vuelve al mapa: el nodo queda completado y el siguiente se ilumina. Repetir un nivel completado no cambia el progreso.
- [x] **CA6:** Al completar el nivel 10 de un mundo hay una celebración especial y suena "¡Completaste el mundo!". Desde "Mundos" se vuelve al selector, donde el mundo aparece completado.
- [x] **CA7:** "Aventura" muestra los 4 mundos en camino:
  - solo está abierto el primer mundo sin completar (y los anteriores, ya completados);
  - los demás aparecen bloqueados;
  - al completar un mundo, el siguiente se desbloquea y su mapa se abre solo.
- [x] **CA8:** Al completar el último mundo en la aventura suena "¡Completaste la aventura!", hay una celebración y la aventura queda con los 4 mundos completados.
- [x] **CA9:** El progreso se conserva al cerrar y volver a abrir la app. Si el almacenamiento no está disponible o tiene datos inválidos, la app funciona igual, empezando sin progreso y sin mostrar errores.
- [x] **CA10:** Un control de adulto en "Mundos" y "Aventura" reinicia todo el progreso tras una confirmación explícita. Si se cancela, no cambia nada.
- [x] **CA11:** El botón "inicio" vuelve al menú desde el selector, la aventura, el mapa y los retos. La voz silenciada se respeta en todas las pantallas nuevas.
- [x] **CA12:** Instalada como PWA y sin conexión, los mundos funcionan con sus audios, temas y progreso guardado.
