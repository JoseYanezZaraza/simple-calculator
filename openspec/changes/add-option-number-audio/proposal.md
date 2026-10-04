> **Linear:** [INN-14](https://linear.app/inno8/issue/INN-14/retos-boton-de-audio-para-escuchar-el-numero-de-cada-opcion) · Proyecto [P-INN-2](https://linear.app/inno8/project/calculadora-interactiva-infantil-952da72f318f) · **Estado:** Draft

## Why

En el reto "¿Cuántas hay?" la niña elige entre tres números escritos que aún no sabe leer, así que puede acabar adivinando en vez de relacionar la cantidad con el número. Un botón de audio por opción le permite **escuchar cómo se llama cada número antes de elegir**. Así refuerza la asociación entre el número escrito y la palabra sin dar la respuesta. Resuelve la pregunta abierta que dejó el diseño de `add-count-challenges`.

## What Changes

- En "¿Cuántas hay?", cada una de las 3 opciones tiene debajo un **botón de altavoz** propio que dice su número ("seis").
- Tocar el altavoz **no es una respuesta**: no hay acierto ni reintento, y el reto no cambia.
- Mientras suena el número, la opción se resalta.
- Un toque en un altavoz cancela la narración en curso (pregunta o "contar juntos"), igual que cualquier otro toque.
- Respeta la voz silenciada (con el mismo resaltado) y queda bloqueado durante la celebración.
- No hay audios nuevos: se usan los clips `0`–`10` existentes.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `count-challenges`: nuevo requisito "Escuchar el número de una opción" en el reto "¿Cuántas hay?".

## Impact

- **Código:**
  - `Narrator`: resaltado de opción en los pasos.
  - `ChallengeSession`: nuevo `sayOption(n)`.
  - `ChallengeScene`: botón de audio bajo cada opción.
  - `RepeatButton` se generaliza a `SpeakerButton`, con tamaño y etiqueta configurables.
- **Recursos y dependencias:** sin cambios.
- **Tests:** unitarios de `ChallengeSession` y `Narrator`, y e2e WebKit iPad en ambas orientaciones.

## Criterios de Aceptación

- [ ] **CA1:** En "¿Cuántas hay?", cada opción tiene su propio botón de audio de al menos 72×72 px que no se solapa con la opción, con al menos 16 px de separación.
- [ ] **CA2:** Tocar el botón de audio de una opción reproduce el número de esa opción y la resalta mientras suena. Si había una narración en curso, se cancela.
- [ ] **CA3:** Tocar un botón de audio no cuenta como respuesta: no hay celebración ni "¡Vamos a contarlas!", el reto sigue igual y se puede responder después.
- [ ] **CA4:** Con la voz silenciada, el botón de audio no reproduce nada, pero la opción se resalta igual.
- [ ] **CA5:** Durante la celebración de un acierto, tocar un botón de audio no hace nada.
