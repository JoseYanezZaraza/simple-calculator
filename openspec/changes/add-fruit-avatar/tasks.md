## 1. Recursos

- [ ] 1.1 Dibujar los 4 personajes cartoon en SVG (`src/assets/avatars/`) con ojos, mejillas, sonrisa y patitas
- [ ] 1.2 Añadir `chooseAvatar` ("¿Quién te acompaña?") a `manifest.ts` y `generate-tts.sh`, y generar el audio

## 2. Estado

- [ ] 2.1 `AvatarStore`: avatar persistido con clave propia, validación de ids y `try/catch`
- [ ] 2.2 `WorldsController`: pantalla `avatarPicker` (primera vez y cambio), `chooseAvatar`, `avatarFrom` al avanzar de nivel y `adventureFrom` al desbloquear
- [ ] 2.3 Tests unitarios de `AvatarStore` y de las nuevas transiciones del controlador (picker solo sin avatar, salto solo al avanzar, el reinicio no toca el avatar)

## 3. UI

- [ ] 3.1 `AvatarPicker.svelte`: "¿Quién te acompaña?" con 4 personajes (≥160 px), el actual marcado y audio de la pregunta
- [ ] 3.2 `Avatar.svelte`: posición en %, animación de reposo, salto en arco con Web Animations, `pointer-events: none`, movimiento reducido y registro `__hopLog` en e2e
- [ ] 3.3 Integrar el avatar en `LevelMap` (nodo siguiente o 10, salto desde el completado) y en `AdventurePath` (mundo actual, salto al desbloquear)
- [ ] 3.4 Botón de avatar en el selector y en la aventura, y hook e2e `window.__avatar.set`
- [ ] 3.5 Revisar con capturas en vertical y apaisado (picker, mapa y aventura con avatar)

## 4. Tests e2e y documentación

- [ ] 4.1 Sembrar un avatar en los e2e de mundos existentes
- [ ] 4.2 e2e: elección la primera vez (Mundos y Aventura), persistencia con recarga, cambio, posición en el mapa y la aventura, toque a través del avatar, salto de nivel y de mundo, repetir sin salto, reinicio y movimiento reducido
- [ ] 4.3 e2e Chromium offline: elegir avatar y verlo en la aventura
- [ ] 4.4 README: avatar, cómo cambiarlo y audio `chooseAvatar`

## 5. Verificación de Criterios de Aceptación

- [ ] 5.1 Verificar **CA1**: picker la primera vez, con 4 personajes de ≥160 px y la pregunta (e2e + unit)
- [ ] 5.2 Verificar **CA2**: el avatar persiste y un almacenamiento que falla no da errores (e2e + unit)
- [ ] 5.3 Verificar **CA3**: el botón de cambio muestra el actual marcado y el cambio se aplica (e2e)
- [ ] 5.4 Verificar **CA4**: el avatar está sobre el nodo siguiente o el 10, y los toques pasan al nodo (e2e)
- [ ] 5.5 Verificar **CA5**: salta al avanzar de nivel y no se mueve al repetir (e2e + unit)
- [ ] 5.6 Verificar **CA6**: en la aventura está sobre el mundo actual y salta al desbloquear (e2e + unit)
- [ ] 5.7 Verificar **CA7**: el reinicio no cambia el avatar y lo devuelve al inicio (e2e + unit)
- [ ] 5.8 Verificar **CA8**: con movimiento reducido no hay salto animado (e2e)
- [ ] 5.9 Verificar **CA9**: funciona sin conexión (e2e Chromium + prueba manual en iPad en modo avión)
- [ ] 5.10 Cumplir la **Definition of Done** de design.md
