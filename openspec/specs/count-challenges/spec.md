# count-challenges Specification

## Purpose
Modo retos: la app propone "¿Cuántas hay?" (cantidad → número) y "Pon N frutas" (número → cantidad) con N de 1 a 10; los aciertos se celebran y las respuestas no correctas llevan a contar juntos y repetir la pregunta, sin indicadores de error.

## Requirements
### Requirement: Encadenamiento de retos
El modo retos SHALL presentar un reto cada vez, elegido al azar entre "¿Cuántas hay?" y "Pon N frutas" con N entero entre 1 y 10. Un reto nuevo MUST NOT ser igual al anterior (mismo tipo y mismo N). No SHALL haber puntuación, contador de aciertos ni límite de retos. (CA7)

#### Scenario: Entrar en el modo retos
- **GIVEN** la app está en la pantalla inicial
- **WHEN** la niña toca el botón "retos"
- **THEN** se muestra un reto de tipo "¿Cuántas hay?" o "Pon N frutas" con 1 ≤ N ≤ 10

#### Scenario: Retos consecutivos distintos
- **GIVEN** el reto actual es "¿Cuántas hay?" con N = 4
- **WHEN** la niña lo acierta y aparece el siguiente reto
- **THEN** el nuevo reto no es "¿Cuántas hay?" con N = 4

### Requirement: Reto "¿Cuántas hay?"
En un reto "¿Cuántas hay?" con objetivo N, el marco de diez SHALL mostrar N frutas en el orden fijo de huecos, el sistema SHALL reproducir "¿Cuántas frutas hay?" y SHALL mostrar 3 opciones de número escrito, grandes y distintas, entre 1 y 10, en orden aleatorio, una de las cuales MUST ser N. Las opciones incorrectas SHALL estar a una distancia de N de 3 como máximo. Los botones ➕/➖ MUST NOT mostrarse en este tipo de reto. (CA2)

#### Scenario: Presentación del reto
- **GIVEN** el modo retos genera "¿Cuántas hay?" con N = 7
- **WHEN** se muestra el reto
- **THEN** el marco muestra 7 frutas en los huecos 1 a 7
- **AND** suena "¿Cuántas frutas hay?"
- **AND** se muestran 3 opciones distintas entre 1 y 10, una de ellas "7" y las otras entre 4 y 10
- **AND** no se muestran los botones ➕ ni ➖

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
Al acertar un reto (tocar la opción N en "¿Cuántas hay?" o tocar ✓ con N frutas en "Pon N frutas"), el sistema SHALL mostrar la celebración, reproducir "¡Muy bien!" e ignorar nuevas respuestas hasta que, tras una pausa de entre 1,5 y 3 segundos, SHALL mostrar el siguiente reto. (CA3, CA6)

#### Scenario: Acertar "¿Cuántas hay?"
- **GIVEN** un reto "¿Cuántas hay?" con N = 3
- **WHEN** la niña toca la opción "3"
- **THEN** se muestra la celebración y suena "¡Muy bien!"
- **AND** en 3 segundos como máximo aparece un reto nuevo

#### Scenario: Acertar "Pon N frutas"
- **GIVEN** un reto "Pon N frutas" con N = 5 y 5 frutas en el marco
- **WHEN** la niña toca ✓
- **THEN** se muestra la celebración y suena "¡Muy bien!"
- **AND** en 3 segundos como máximo aparece un reto nuevo

#### Scenario: Toques durante la celebración
- **GIVEN** la niña acaba de acertar un reto "¿Cuántas hay?"
- **WHEN** toca otra opción antes de que aparezca el siguiente reto
- **THEN** no ocurre nada más y el siguiente reto aparece igualmente

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
Los controles de adulto SHALL incluir un botón "inicio", discreto y agrupado con los demás, que en el juego libre y en los retos detiene el audio y vuelve a la pantalla inicial. Al volver a entrar, el juego libre MUST empezar con 0 frutas y los retos con un reto nuevo. La voz y la fruta elegidas MUST conservarse. (CA9)

#### Scenario: Salir de los retos
- **GIVEN** la niña está en un reto
- **WHEN** el adulto toca "inicio"
- **THEN** se muestra la pantalla inicial con los botones "jugar libre" y "retos"

#### Scenario: Salir del juego libre y volver
- **GIVEN** el juego libre tiene 5 frutas y la fruta elegida es plátano
- **WHEN** el adulto toca "inicio" y después la niña toca "jugar libre"
- **THEN** el marco está vacío y la fruta sigue siendo plátano

### Requirement: Retos con voz silenciada y fruta elegida
Los retos SHALL respetar la voz silenciada (ningún audio, mismo comportamiento visual y mismos tiempos de paso al siguiente reto) y la fruta elegida por el adulto. Los controles de voz y fruta SHALL estar disponibles también en los retos. (CA10)

#### Scenario: Reintento con la voz silenciada
- **GIVEN** la voz está desactivada y un reto "¿Cuántas hay?" con N = 3
- **WHEN** la niña toca una opción incorrecta
- **THEN** se resaltan las frutas una a una de la 1 a la 3
- **AND** no suena ningún audio

#### Scenario: Fruta elegida en los retos
- **GIVEN** el adulto eligió fresa
- **WHEN** aparece un reto "¿Cuántas hay?"
- **THEN** todas las frutas del marco son fresas

### Requirement: Retos sin conexión
Los audios nuevos de los retos SHALL formar parte del catálogo precacheado por el service worker, de modo que el modo retos MUST funcionar sin conexión tras la primera carga. (CA11)

#### Scenario: Retos en modo avión
- **GIVEN** la app instalada se cargó al menos una vez con conexión
- **WHEN** el iPad está en modo avión y la niña entra en "retos"
- **THEN** el reto se muestra y suena su pregunta

