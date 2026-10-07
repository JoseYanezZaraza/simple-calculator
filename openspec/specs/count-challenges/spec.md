# count-challenges Specification

## Purpose
Modo retos: la app propone "¿Cuántas hay?" (cantidad → número) y "Pon N frutas" (número → cantidad) con N de 1 a 10; los aciertos se celebran y las respuestas no correctas llevan a contar juntos y repetir la pregunta, sin indicadores de error.
## Requirements
### Requirement: Encadenamiento de retos
Los retos SHALL jugarse dentro de los niveles de un mundo (ver `world-map`). Cada nivel presenta un reto, elegido al azar entre "¿Cuántas hay?" y "Pon N frutas", con N entero entre 1 y el máximo del mundo. Un reto nuevo MUST NOT ser igual al último jugado en la sesión (mismo tipo y mismo N). No SHALL haber puntuación ni contador de aciertos: un nivel se completa al acertar su reto. (CA4 de add-world-map)

#### Scenario: Iniciar un nivel
- **GIVEN** la niña está en el mapa del mundo plátano
- **WHEN** toca el nodo iluminado
- **THEN** se muestra un reto de tipo "¿Cuántas hay?" o "Pon N frutas" con 1 ≤ N ≤ 5

#### Scenario: Retos consecutivos distintos
- **GIVEN** el último reto jugado fue "¿Cuántas hay?" con N = 4
- **WHEN** la niña inicia otro nivel
- **THEN** el nuevo reto no es "¿Cuántas hay?" con N = 4

### Requirement: Reto "¿Cuántas hay?"
En un reto "¿Cuántas hay?" con objetivo N en un mundo de máximo M, el marco de diez SHALL mostrar N frutas en el orden fijo de huecos, el sistema SHALL reproducir "¿Cuántas frutas hay?" y SHALL mostrar 3 opciones de número escrito, grandes y distintas, entre 1 y M, en orden aleatorio, una de las cuales MUST ser N. Las opciones incorrectas SHALL estar a una distancia de N de 3 como máximo. Los botones ➕/➖ MUST NOT mostrarse en este tipo de reto. (CA4 de add-world-map)

#### Scenario: Presentación del reto
- **GIVEN** un nivel del mundo naranja genera "¿Cuántas hay?" con N = 7
- **WHEN** se muestra el reto
- **THEN** el marco muestra 7 frutas en los huecos 1 a 7
- **AND** suena "¿Cuántas frutas hay?"
- **AND** se muestran 3 opciones distintas entre 1 y 10, una de ellas "7" y las otras entre 4 y 10
- **AND** no se muestran los botones ➕ ni ➖

#### Scenario: Opciones en un mundo de rango corto
- **GIVEN** un nivel del mundo manzana (máximo 3) genera "¿Cuántas hay?"
- **WHEN** se muestra el reto
- **THEN** las opciones son 1, 2 y 3 en algún orden

#### Scenario: Contar tocando una fruta
- **GIVEN** un reto "¿Cuántas hay?" con N = 5
- **WHEN** la niña toca una fruta
- **THEN** se cuentan en voz alta de 1 a 5 resaltando cada fruta, como en el juego libre

### Requirement: Reto "Pon N frutas"
En un reto "Pon N frutas", el marco SHALL empezar vacío, el sistema SHALL mostrar N escrito en grande y reproducir "Pon" seguido del número N. Los botones ➕/➖ SHALL funcionar como en el juego libre (0–10, frase amable en 0, locución del número), salvo que llegar a 10 MUST NOT mostrar la celebración ni la frase de lleno. Un botón ✓ SHALL permitir confirmar la respuesta. (CA5)

#### Scenario: Presentación del reto
- **GIVEN** el modo retos genera "Pon N frutas" con N = 4
- **WHEN** se muestra el reto
- **THEN** el marco está vacío
- **AND** se muestra "4" escrito en grande
- **AND** suena "Pon" seguido de "cuatro"
- **AND** se muestran los botones ➖, ✓ y ➕

#### Scenario: Construir la cantidad
- **GIVEN** un reto "Pon N frutas" con N = 4 y el marco vacío
- **WHEN** la niña toca ➕ tres veces
- **THEN** el marco muestra 3 frutas
- **AND** suena "tres" tras el último toque

#### Scenario: Llegar a 10 durante el reto
- **GIVEN** un reto "Pon N frutas" con N = 6 y 9 frutas en el marco
- **WHEN** la niña toca ➕
- **THEN** el marco muestra 10 frutas y suena "diez"
- **AND** no se muestra la celebración ni suena la frase de lleno

### Requirement: Acierto
Al acertar un reto (tocar la opción N en "¿Cuántas hay?" o tocar ✓ con N frutas en "Pon N frutas"), el sistema SHALL mostrar la celebración, reproducir "¡Muy bien!" e ignorar nuevas respuestas hasta que, tras una pausa de entre 1,5 y 3 segundos, SHALL volver al mapa de niveles del mundo con el nivel completado. (CA5 de add-world-map)

#### Scenario: Acertar "¿Cuántas hay?"
- **GIVEN** un reto "¿Cuántas hay?" con N = 3
- **WHEN** la niña toca la opción "3"
- **THEN** se muestra la celebración y suena "¡Muy bien!"
- **AND** en 3 segundos como máximo se muestra el mapa de niveles

#### Scenario: Acertar "Pon N frutas"
- **GIVEN** un reto "Pon N frutas" con N = 5 y 5 frutas en el marco
- **WHEN** la niña toca ✓
- **THEN** se muestra la celebración y suena "¡Muy bien!"
- **AND** en 3 segundos como máximo se muestra el mapa de niveles

#### Scenario: Toques durante la celebración
- **GIVEN** la niña acaba de acertar un reto "¿Cuántas hay?"
- **WHEN** toca otra opción antes de volver al mapa
- **THEN** no ocurre nada más y el mapa aparece igualmente

### Requirement: Respuesta no correcta: contar juntos
Ante una respuesta no correcta, el sistema SHALL reproducir "¡Vamos a contarlas!", contar en voz alta de 1 al número de frutas del marco resaltando cada fruta y, al terminar, repetir la pregunta del reto. El reto MUST mantenerse (mismo N, mismas opciones, mismas frutas) y MUST NOT mostrarse ningún indicador de error (icono, color rojo, sonido de fallo). (CA4, CA6)

#### Scenario: Opción incorrecta en "¿Cuántas hay?"
- **GIVEN** un reto "¿Cuántas hay?" con N = 6 y opciones 4, 6 y 8
- **WHEN** la niña toca "8"
- **THEN** suena "¡Vamos a contarlas!" y después "uno" … "seis" resaltando cada fruta
- **AND** después suena "¿Cuántas frutas hay?"
- **AND** siguen las mismas 6 frutas y las opciones 4, 6 y 8
- **AND** no se muestra ningún indicador de error

#### Scenario: Confirmar con otra cantidad en "Pon N frutas"
- **GIVEN** un reto "Pon N frutas" con N = 4 y 6 frutas en el marco
- **WHEN** la niña toca ✓
- **THEN** suena "¡Vamos a contarlas!" y después "uno" … "seis" resaltando cada fruta
- **AND** después suena "Pon" seguido de "cuatro"
- **AND** el marco sigue con 6 frutas y se puede seguir ajustando con ➕/➖

#### Scenario: Confirmar con el marco vacío
- **GIVEN** un reto "Pon N frutas" con N = 2 y el marco vacío
- **WHEN** la niña toca ✓
- **THEN** suena "¡Vamos a contarlas!" seguido de la repetición de "Pon" y "dos", sin conteo

### Requirement: Repetir la pregunta
La escena de retos SHALL mostrar un botón grande de altavoz que, al tocarlo, reproduce de nuevo la pregunta del reto actual ("¿Cuántas frutas hay?" o "Pon" + N). (CA8)

#### Scenario: Repetir "Pon N"
- **GIVEN** un reto "Pon N frutas" con N = 9
- **WHEN** la niña toca el botón de repetir
- **THEN** suena "Pon" seguido de "nueve"

### Requirement: Volver al inicio
Los controles de adulto SHALL incluir un botón "inicio", discreto y agrupado con los demás, que en el juego libre, el selector de mundos, la aventura, el mapa de niveles y los retos detiene el audio y vuelve a la pantalla inicial. Al volver a entrar, el juego libre MUST empezar con 0 frutas. La voz, la fruta elegida para el juego libre y el progreso de los mundos MUST conservarse. (CA11 de add-world-map)

#### Scenario: Salir de un reto
- **GIVEN** la niña está en un reto de un mundo
- **WHEN** el adulto toca "inicio"
- **THEN** se muestra la pantalla inicial con los botones "Jugar libre", "Mundos" y "Aventura"

#### Scenario: Salir del juego libre y volver
- **GIVEN** el juego libre tiene 5 frutas y la fruta elegida es plátano
- **WHEN** el adulto toca "inicio" y después la niña toca "Jugar libre"
- **THEN** el marco está vacío y la fruta sigue siendo plátano

### Requirement: Retos con voz silenciada y fruta elegida
Los retos SHALL respetar la voz silenciada: ningún audio, el mismo comportamiento visual y los mismos tiempos de vuelta al mapa. Las frutas del marco SHALL ser las del mundo del nivel, no la fruta elegida por el adulto para el juego libre. En los retos, los controles de adulto SHALL incluir la voz, pero no el selector de fruta. (CA4 y CA11 de add-world-map)

#### Scenario: Reintento con la voz silenciada
- **GIVEN** la voz está desactivada y un reto "¿Cuántas hay?" con N = 3
- **WHEN** la niña toca una opción incorrecta
- **THEN** se resaltan las frutas una a una de la 1 a la 3
- **AND** no suena ningún audio

#### Scenario: Fruta del mundo en los retos
- **GIVEN** el adulto eligió fresa para el juego libre
- **WHEN** la niña juega un nivel del mundo naranja y aparece un reto "¿Cuántas hay?"
- **THEN** todas las frutas del marco son naranjas

### Requirement: Escuchar el número de una opción
En un reto "¿Cuántas hay?", cada opción SHALL tener debajo un botón de audio propio, de al menos 72×72 px CSS, sin solaparse con la opción y separado de ella al menos 16 px. Al tocarlo, el sistema SHALL cancelar la narración en curso, reproducir el clip del número de esa opción y resaltar la opción durante ese paso. Tocar un botón de audio MUST NOT contar como respuesta: no SHALL producir acierto, celebración ni el reintento "contar juntos", y el reto MUST mantenerse. Con la voz silenciada el resaltado SHALL ocurrir igual, sin audio. Durante la fase de celebración, el botón de audio MUST NOT tener efecto. (CA1–CA5)

#### Scenario: Botón de audio por opción
- **GIVEN** un reto "¿Cuántas hay?" con opciones 4, 6 y 8
- **WHEN** se muestra el reto en un iPad, en vertical o en apaisado
- **THEN** hay un botón de audio bajo cada una de las 3 opciones
- **AND** cada botón de audio mide al menos 72×72 px y está separado al menos 16 px de su opción

#### Scenario: Escuchar una opción
- **GIVEN** un reto "¿Cuántas hay?" con N = 6 y opciones 4, 6 y 8, y la voz activada
- **WHEN** la niña toca el botón de audio de la opción "8"
- **THEN** suena "ocho"
- **AND** la opción "8" se resalta mientras suena y deja de estarlo al terminar

#### Scenario: Escuchar no es responder
- **GIVEN** un reto "¿Cuántas hay?" con N = 6 y opciones 4, 6 y 8
- **WHEN** la niña toca el botón de audio de "8" y después el de "6"
- **THEN** no se muestra la celebración y no suena "¡Vamos a contarlas!"
- **AND** el reto sigue siendo "¿Cuántas hay?" con N = 6 y las mismas opciones
- **AND** si después toca la opción "6", es un acierto

#### Scenario: Interrumpir el conteo
- **GIVEN** un reto "¿Cuántas hay?" en el que suena el reintento "contar juntos"
- **WHEN** la niña toca el botón de audio de una opción
- **THEN** el conteo se detiene y suena solo el número de esa opción

#### Scenario: Voz silenciada
- **GIVEN** la voz está desactivada y un reto "¿Cuántas hay?" con opciones 2, 3 y 4
- **WHEN** la niña toca el botón de audio de "3"
- **THEN** no suena ningún audio
- **AND** la opción "3" se resalta durante el mismo tiempo que con voz

#### Scenario: Durante la celebración
- **GIVEN** la niña acaba de acertar un reto "¿Cuántas hay?"
- **WHEN** toca un botón de audio antes de que aparezca el siguiente reto
- **THEN** no suena nada más y el siguiente reto aparece igualmente

