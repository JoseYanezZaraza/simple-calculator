## MODIFIED Requirements

### Requirement: Pantalla inicial de juego
La app SHALL arrancar en una pantalla inicial con dos botones grandes con dibujo y etiqueta: "jugar libre" y "retos". Al tocar "jugar libre" MUST entrar en la escena de juego libre con 0 frutas y, al tocar "retos", MUST entrar en el modo retos. Ambos botones SHALL tener al menos 160×160 px CSS en un iPad. (CA1 de add-count-challenges; sustituye a CA11 de add-free-play-ten-frame)

#### Scenario: Entrar al juego libre desde la pantalla inicial
- **GIVEN** la app acaba de abrirse
- **WHEN** la niña toca el botón "jugar libre"
- **THEN** se muestra la escena de juego con el marco de diez vacío
- **AND** el número escrito muestra "0"

#### Scenario: Entrar en los retos desde la pantalla inicial
- **GIVEN** la app acaba de abrirse
- **WHEN** la niña toca el botón "retos"
- **THEN** se muestra el primer reto

#### Scenario: Tamaño de los botones de la pantalla inicial
- **GIVEN** la pantalla inicial se muestra en un iPad en cualquier orientación
- **WHEN** se miden los botones "jugar libre" y "retos"
- **THEN** cada uno mide al menos 160×160 px CSS
