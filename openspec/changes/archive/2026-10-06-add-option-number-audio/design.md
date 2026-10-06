## Context

`add-count-challenges` (INN-13) dejó el reto "¿Cuántas hay?" con:
- 3 opciones neutras (`ActionButton variant="option"`);
- un botón de altavoz grande que repite la pregunta (`RepeatButton`);
- un `Narrator` que reproduce pasos cancelables (clips y resaltado de fruta) con los mismos tiempos aunque la voz esté silenciada;
- `ChallengeSession`, con las fases `asking` y `celebrating`.

Su design dejaba abierta una pregunta: si debía oírse el número de las opciones. La decisión del usuario es añadir un botón de audio por opción que **no** cuente como respuesta.

## Goals / Non-Goals

**Goals:**
- Oír el nombre de cada opción sin responder (CA2, CA3).
- Resaltado visual sincronizado con el audio, también con la voz silenciada (CA2, CA4).
- Coherencia con el modelo de interacción: un toque nuevo cancela la narración, y en `celebrating` no se acepta nada (CA5).
- Sin audios nuevos ni dependencias.

**Non-Goals:**
- Decir el número al tocar la opción misma (seguiría siendo una respuesta).
- Botones de audio en "Pon N frutas" o en el juego libre.

## Decisions

### D1. Botón separado debajo de cada opción
Cada opción se apila en vertical con un altavoz de 80 px y 16 px de separación.
- *Alternativa descartada:* un icono pequeño superpuesto en la esquina de la opción. Un toque impreciso de una niña de 3 años respondería sin querer, que es justo lo que este cambio quiere evitar.
- *Alternativa descartada:* pulsación larga sobre la opción. No se descubre sola y choca con la supresión del menú contextual de iPadOS.

### D2. Resaltado de opción a través del `Narrator`
`NarrationStep` gana un campo opcional `option?: number`, y `Narrator` expone `option = $state<number | null>()`, que se limpia en `cancel()` y al terminar, igual que `highlighted`. `ChallengeSession.sayOption(n)` ejecuta `narrator.run([{ clips: [numberClip(n)], option: n }])` solo si `accepting` y el reto es `howMany`.

Ventajas:
- Reutiliza la duración por paso (≥750 ms o la duración del clip más 150 ms), así que el resaltado dura lo mismo con o sin voz (CA4).
- Cualquier toque posterior (otra opción, fruta, repetir, responder) cancela el paso y limpia el resaltado sin lógica extra (CA2).
- *Alternativa descartada:* estado propio en `ChallengeSession` con su propio temporizador. Duplicaría la cancelación y podría dejar una opción resaltada colgada.

### D3. `RepeatButton` pasa a ser `SpeakerButton`
Props `label`, `testid` y `size: 'large' | 'small'` (120 / 80 px). Se usa en "repetir la pregunta" (grande) y bajo cada opción (pequeño, `testid="option-audio"`). El resaltado de la opción es un anillo amarillo (`--highlight`) igual en todas, para que no dé pistas de cuál es la correcta.

### D4. Layout
La fila de acciones de "¿Cuántas hay?" pasa a ser 3 columnas de opción más altavoz, de unos 260 px de alto. En apaisado (iPad, 810 px de alto) cabe con el marco a la izquierda. Se verifica con capturas y con el e2e de tamaños en ambas orientaciones.

## Risks / Trade-offs

- [Más botones en pantalla distraen o confunden] → El altavoz es secundario: más pequeño, color madera y el mismo icono que "repetir". Se valida al probarlo con la niña.
- [Toque accidental en la opción al buscar el altavoz] → Separación de 16 px y altavoz de 80 px (D1).
- [Apaisado ajustado en iPads pequeños] → Opciones con `clamp()`. Si no caben, se reduce la opción, nunca por debajo de 120 px.

## Definition of Done (técnica)

- [x] Tests automatizados cubren cada Criterio de Aceptación del proposal
- [x] Los tests existentes siguen pasando
- [x] Lint / formato / typecheck en verde (`svelte-check`, ESLint, Prettier)
- [x] `openspec validate --strict` sin errores
- [x] Documentación actualizada: README (retos)
- [x] PR en GitHub enlazado al issue de Linear INN-14
- [x] Probado en un iPad real (verificado por el usuario el 2026-10-06)
