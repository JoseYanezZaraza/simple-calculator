> **Linear:** [INN-16](https://linear.app/inno8/issue/INN-16/avatar-fruta-cartoon-elegida-por-la-nina-que-salta-entre-niveles-y) · Proyecto [P-INN-2](https://linear.app/inno8/project/calculadora-interactiva-infantil-952da72f318f) · **Estado:** Draft · Depende de `add-world-map` (INN-15)

## Why

En los mapas de niveles y en la aventura (INN-15) el progreso se ve en nodos marcados, pero nada representa a la niña en el camino. Un **avatar propio, una fruta cartoon que ella elige**, la sitúa en el mapa ("¡aquí estoy!") y, al **saltar** al siguiente nivel o mundo cuando avanza, convierte cada acierto en un pequeño viaje visible. Además, elegir a su personaje le da una sensación de pertenencia.

## What Changes

- **4 personajes cartoon:** manzana, plátano, fresa y naranja, con ojos, sonrisa y patitas, y una animación de reposo (un pequeño balanceo).
- **Elección del avatar:** la primera vez que se entra en "Mundos" o "Aventura" aparece "¿Quién te acompaña?", con voz y los 4 personajes en grande. Al elegir, se guarda en el iPad y se continúa a la pantalla pedida.
- **Botón para cambiar de avatar** en el selector de mundos y en el camino de la aventura. Muestra el avatar actual y abre la misma pantalla de elección.
- **En el mapa de niveles:** el avatar está sobre el nodo siguiente, o sobre el 10 si el mundo está completo. Al volver al mapa tras completar un nivel, salta en arco desde el nodo completado hasta el nuevo siguiente.
- **En la aventura:** el avatar está sobre el mundo actual. Al desbloquearse el siguiente, salta de un mundo al otro durante la pausa previa a abrirlo.
- **El avatar no es interactivo:** los toques pasan a los nodos.
- Reiniciar el progreso **no** borra el avatar, que vuelve al nodo 1 o al primer mundo.
- Con "reducir movimiento" activado, el avatar cambia de posición sin arco.
- 1 audio nuevo, `chooseAvatar` ("¿Quién te acompaña?"), y los personajes en SVG, todo precacheado.

## Capabilities

### New Capabilities
- `avatar`: personajes, elección y persistencia del avatar, su posición y salto en el mapa de niveles y en la aventura, interacción con el reinicio, movimiento reducido y funcionamiento offline.

### Modified Capabilities
<!-- Ninguna en specs/ principales: `world-map` aún está en el cambio add-world-map sin archivar. El avatar se especifica como capacidad propia que se apoya en sus pantallas. -->

## Impact

- **Código:**
  - `src/assets/avatars/`: 4 SVG cartoon.
  - `src/state/avatar.svelte.ts`: avatar elegido, persistido en `localStorage` con su propia clave.
  - `WorldsController`: pantalla de elección y posición anterior para el salto.
  - Nuevos `AvatarPicker.svelte` y `Avatar.svelte`.
  - `LevelMap` y `AdventurePath` colocan y animan el avatar.
- **Recursos:** 1 audio TTS y 4 SVG.
- **Tests:** unitarios del store y del controlador, y e2e de elección, persistencia, posición y salto.
- **Sin dependencias nuevas.**

## Criterios de Aceptación

- [ ] **CA1:** La primera vez que se entra en "Mundos" o "Aventura" sin avatar guardado aparece "¿Quién te acompaña?" con 4 personajes cartoon de al menos 160 px, y suena la pregunta. Al elegir uno se continúa a la pantalla pedida.
- [ ] **CA2:** El avatar elegido se conserva al cerrar y volver a abrir la app, y la pantalla de elección no vuelve a aparecer sola. Si el almacenamiento falla, se puede elegir y jugar igual, sin errores.
- [ ] **CA3:** Un botón en el selector de mundos y en la aventura muestra el avatar actual y abre la pantalla de elección, con el actual marcado. Elegir otro lo sustituye en todos los mapas.
- [ ] **CA4:** En el mapa de niveles, el avatar elegido está sobre el nodo siguiente, o sobre el 10 si el mundo está completo. Tocar el nodo que tiene debajo inicia su reto.
- [ ] **CA5:** Al volver al mapa tras completar un nivel, el avatar salta desde el nodo completado hasta el nuevo siguiente. Repetir un nivel ya completado no lo mueve.
- [ ] **CA6:** En la aventura, el avatar está sobre el mundo actual (el primero sin completar, o el último si todo está completo). Al desbloquearse el siguiente, salta del mundo completado al nuevo antes de que se abra.
- [ ] **CA7:** Reiniciar el progreso no cambia el avatar elegido, y este vuelve al nodo 1 o al primer mundo.
- [ ] **CA8:** Con "reducir movimiento" activado en el sistema, el avatar cambia de posición sin animación de salto.
- [ ] **CA9:** Instalada como PWA y sin conexión, la elección, los personajes y el salto funcionan, con el audio de la pregunta.
