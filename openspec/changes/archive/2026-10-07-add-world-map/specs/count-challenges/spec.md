## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Retos sin conexión
**Reason**: Ya no hay un modo "retos" independiente. El funcionamiento offline de los retos, sus audios y los nuevos lo cubre el requisito "Mundos sin conexión" de `world-map`.
**Migration**: Ver "Mundos sin conexión" en `openspec/specs/world-map/spec.md`.
