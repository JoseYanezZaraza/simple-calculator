> **Linear:** [INN-13](https://linear.app/inno8/issue/INN-13/incremento-2-retos-cuantas-hay-y-pon-n-frutas) · Proyecto [P-INN-2](https://linear.app/inno8/project/calculadora-interactiva-infantil-952da72f318f) · **Estado:** Implementado (PR #3)

## Why

El juego libre (INN-12) permite explorar las cantidades, pero la niña nunca tiene que **reconocer** una cantidad ni **construirla** a partir de un número. Los retos "¿Cuántas hay?" y "Pon N frutas" practican esas dos direcciones (cantidad → número y número → cantidad). Mantienen el principio de no penalizar: si la respuesta no es correcta, se cuenta juntos y se vuelve a intentar.

## What Changes

- La pantalla inicial pasa de un único botón "¡A jugar!" a **dos botones grandes con dibujo**: "jugar libre" y "retos". Cualquiera de los dos desbloquea el audio. **BREAKING** respecto a la spec de la pantalla inicial.
- Nuevo **modo retos**, que encadena retos al azar de dos tipos:
  - **"¿Cuántas hay?":** el marco muestra N frutas (1–10) y la niña elige el número entre 3 opciones escritas.
  - **"Pon N frutas":** la voz pide N (1–10) y la niña construye la cantidad con ➕/➖ desde el marco vacío y confirma con ✓.
- **Acierto:** celebración, "¡Muy bien!" y siguiente reto.
- **Respuesta no correcta:** "¡Vamos a contarlas!", conteo de las frutas con resaltado y repetición de la pregunta, en el mismo reto.
- Botón para **repetir la pregunta** en voz alta.
- Nuevo **control de adulto "inicio"** que vuelve a la pantalla inicial desde cualquier modo.
- **Audios nuevos** con nombres estables y sustituibles: "¿Cuántas frutas hay?", "Pon", "¡Muy bien!" y "¡Vamos a contarlas!".

## Capabilities

### New Capabilities
- `count-challenges`: modo retos: generación de retos, "¿Cuántas hay?", "Pon N frutas", acierto, reintento con conteo, repetición de la pregunta y vuelta al inicio.

### Modified Capabilities
- `ten-frame-play`: la "Pantalla inicial de juego" pasa a ofrecer "jugar libre" y "retos".
- `voice-feedback`: el "Desbloqueo de audio con el primer toque" ocurre con cualquiera de los dos botones de la pantalla inicial.

## Impact

- **Código:**
  - Nuevo núcleo `src/core/challenges.ts` (generación y evaluación de retos, puro).
  - Estado de retos en `src/state/`.
  - Componentes de pantalla inicial con selector, escena de retos y botón de inicio.
  - El conteo con resaltado se reutiliza del incremento 1.
- **Recursos:** 4 audios nuevos en `public/audio/es/` (`howMany`, `put`, `wellDone`, `letsCount`) y dibujos para los dos botones de la pantalla inicial.
- **Tests:** unitarios del núcleo de retos y e2e WebKit iPad para cada CA. Hay que actualizar los e2e del incremento 1 que entran por "¡A jugar!".
- **Sin dependencias nuevas.**

## Criterios de Aceptación

- [x] **CA1:** La pantalla inicial muestra dos botones, "jugar libre" y "retos". "Jugar libre" entra en el juego libre con el comportamiento del incremento 1 y "retos" entra en el modo retos. Con cualquiera de los dos, el audio queda habilitado.
- [x] **CA2:** En "¿Cuántas hay?", el marco muestra N frutas (1 ≤ N ≤ 10), suena "¿Cuántas frutas hay?" y aparecen 3 opciones de número distintas entre 1 y 10, una de ellas N.
- [x] **CA3:** Al acertar un reto se muestra la celebración, suena "¡Muy bien!" y, tras una breve pausa, aparece un reto nuevo.
- [x] **CA4:** Al tocar una opción incorrecta en "¿Cuántas hay?", suena "¡Vamos a contarlas!", se cuentan las N frutas de 1 a N resaltándolas y se repite la pregunta. Las opciones y las frutas no cambian y no aparece ningún indicador de error.
- [x] **CA5:** En "Pon N frutas", el marco empieza vacío, se muestra N escrito, suena "Pon N" y ➕/➖ añaden y quitan frutas como en el juego libre (0–10). Al llegar a 10 no hay celebración.
- [x] **CA6:** En "Pon N frutas", tocar ✓ con N frutas es un acierto (CA3). Con otra cantidad, se cuentan las frutas actuales y se repite "Pon N" sin vaciar el marco.
- [x] **CA7:** Dos retos consecutivos nunca son iguales (mismo tipo y mismo N).
- [x] **CA8:** Tocar el botón de repetir vuelve a reproducir la pregunta del reto actual.
- [x] **CA9:** El control de adulto "inicio" vuelve a la pantalla inicial desde el juego libre y desde los retos.
- [x] **CA10:** Con la voz silenciada los retos funcionan igual, con celebración, conteo resaltado y paso al siguiente reto, sin sonar ningún audio. La fruta elegida por el adulto se usa en los retos.
- [x] **CA11:** Instalada como PWA y sin conexión, el modo retos funciona con sus audios nuevos.
