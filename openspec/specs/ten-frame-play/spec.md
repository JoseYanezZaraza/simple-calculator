# ten-frame-play Specification

## Purpose
TBD - created by archiving change add-free-play-ten-frame. Update Purpose after archive.
## Requirements
### Requirement: Pantalla inicial de juego
La app SHALL arrancar en una pantalla "¡A jugar!" con un único botón grande, y al tocarlo MUST entrar en la escena de juego libre con 0 frutas. (CA11)

#### Scenario: Entrar al juego desde la pantalla inicial
- **GIVEN** la app acaba de abrirse
- **WHEN** la niña toca el botón "¡A jugar!"
- **THEN** se muestra la escena de juego con el marco de diez vacío
- **AND** el número escrito muestra "0"

### Requirement: Marco de diez con rango 0–10
La escena SHALL mostrar un marco de diez de 2 filas × 5 huecos y una cantidad de frutas entre 0 y 10, ambos incluidos. La cantidad MUST ser la única fuente de verdad para el marco, el número escrito y el audio.

#### Scenario: Estado inicial de la escena
- **GIVEN** la niña acaba de entrar en la escena de juego
- **WHEN** se renderiza el marco
- **THEN** hay 10 huecos visibles en 2 filas de 5
- **AND** ningún hueco contiene fruta

### Requirement: Añadir una fruta
Al tocar ➕ con N < 10, el sistema SHALL incrementar la cantidad a N+1, animar la llegada de la fruta a su hueco y actualizar el número escrito a N+1. (CA1)

#### Scenario: Añadir con espacio libre
- **GIVEN** el marco tiene 3 frutas
- **WHEN** la niña toca ➕
- **THEN** el marco muestra 4 frutas
- **AND** el número escrito muestra "4"

### Requirement: Quitar una fruta
Al tocar ➖ con N > 0, el sistema SHALL decrementar la cantidad a N−1, animar la salida de la última fruta colocada y actualizar el número escrito a N−1. (CA2)

#### Scenario: Quitar con frutas presentes
- **GIVEN** el marco tiene 7 frutas
- **WHEN** la niña toca ➖
- **THEN** el marco muestra 6 frutas
- **AND** el número escrito muestra "6"
- **AND** la fruta que sale es la del hueco 7

### Requirement: Límite superior en 10
Con 10 frutas, el botón ➕ SHALL mostrarse desactivado y tocarlo MUST NOT cambiar la cantidad. Cada vez que la cantidad pase de 9 a 10, el sistema SHALL mostrar una celebración visual breve. (CA3)

#### Scenario: Llegar a 10 frutas
- **GIVEN** el marco tiene 9 frutas
- **WHEN** la niña toca ➕
- **THEN** el marco muestra 10 frutas y el número "10"
- **AND** se muestra una celebración
- **AND** el botón ➕ aparece desactivado

#### Scenario: Volver a llegar a 10 en la misma sesión
- **GIVEN** el marco llegó a 10 frutas y la niña tocó ➖ para dejar 9
- **WHEN** la niña toca ➕
- **THEN** se vuelve a mostrar la celebración

#### Scenario: Tocar ➕ con el marco lleno
- **GIVEN** el marco tiene 10 frutas
- **WHEN** la niña toca ➕
- **THEN** la cantidad sigue siendo 10

### Requirement: Límite inferior en 0
Con 0 frutas, el botón ➖ SHALL mostrarse desactivado y tocarlo MUST NOT cambiar la cantidad ni mostrar ningún indicador de error. (CA4)

#### Scenario: Tocar ➖ con el marco vacío
- **GIVEN** el marco tiene 0 frutas
- **WHEN** la niña toca ➖
- **THEN** la cantidad sigue siendo 0
- **AND** el botón ➖ aparece desactivado
- **AND** no se muestra ningún mensaje ni icono de error

### Requirement: Orden de llenado fijo
Las frutas SHALL ocupar los huecos en orden fijo: huecos 1–5 de la fila superior de izquierda a derecha y después huecos 6–10 de la fila inferior de izquierda a derecha. Con cantidad N, MUST haber fruta exactamente en los huecos 1..N. (CA5)

#### Scenario: Distribución con 7 frutas
- **GIVEN** el marco está vacío
- **WHEN** la niña toca ➕ siete veces
- **THEN** la fila superior tiene sus 5 huecos ocupados
- **AND** la fila inferior tiene ocupados sus 2 primeros huecos por la izquierda y 3 vacíos

#### Scenario: Orden tras alternar añadir y quitar
- **GIVEN** el marco tiene 6 frutas
- **WHEN** la niña toca ➖ dos veces y luego ➕ una vez
- **THEN** hay fruta exactamente en los huecos 1 a 5

### Requirement: Selección de fruta por el adulto
Un control de adulto discreto SHALL permitir elegir la fruta de la sesión entre al menos 3 opciones. Todas las frutas visibles MUST ser del mismo tipo, y cambiar de fruta MUST NOT alterar la cantidad. (CA8)

#### Scenario: Cambiar de fruta con frutas en el marco
- **GIVEN** el marco tiene 4 manzanas
- **WHEN** el adulto elige "plátano" en el control de fruta
- **THEN** el marco muestra 4 plátanos y ninguna manzana
- **AND** el número escrito sigue mostrando "4"

